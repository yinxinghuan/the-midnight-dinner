import { useCallback, useEffect, useRef, useState } from 'react';
import { t } from './i18n';
import { CONTENT } from './content';
import type { Phase, SpotDef } from './types';
import './BiddingEngine.less';

const BASE = import.meta.env.BASE_URL;
const videoUrl = (rel: string) => BASE + 'videos/' + rel;
const stillUrl = (rel: string) => BASE + 'stills/' + rel;

const SUBTITLE_DELAY_MS = 900;
const HOLD_AFTER_END_MS = 2400;
const VIDEO_FADE_MS = 900;
const CLIMAX_SUBTITLE_DELAY_MS = 4400;
const REVELATION_HOLD_MS = 4500;

// V1 framework engine — single hero + 5 rectangular hotspots + 1 climax/ending.
// Modeled on replicant-wake/src/Game/Game.tsx (the canonical V1 reference).
export default function BiddingEngine() {
  const [taps, setTaps] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentSpot, setCurrentSpot] = useState<SpotDef | null>(null);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [videoFallback, setVideoFallback] = useState(false);
  const [videoExiting, setVideoExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const subTimerRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);

  const debug = typeof window !== 'undefined' && window.location.search.includes('debug');

  const clearTimers = () => {
    [subTimerRef, holdTimerRef, fadeTimerRef].forEach((r) => {
      if (r.current) { window.clearTimeout(r.current); r.current = null; }
    });
  };

  const playClip = useCallback((spot: SpotDef) => {
    if (phase !== 'idle') return;
    clearTimers();
    setCurrentSpot(spot);
    setVideoFallback(false);
    setVideoExiting(false);
    setSubtitleVisible(false);
    setPhase('playing-clip');
    subTimerRef.current = window.setTimeout(() => {
      setSubtitleVisible(true);
    }, SUBTITLE_DELAY_MS);
  }, [phase]);

  const onClipEnded = useCallback(() => {
    if (!currentSpot) return;
    setPhase('holding-subtitle');
    setSubtitleVisible(true);

    fadeTimerRef.current = window.setTimeout(() => {
      setVideoExiting(true);
      setSubtitleVisible(false);
    }, HOLD_AFTER_END_MS - VIDEO_FADE_MS);

    holdTimerRef.current = window.setTimeout(() => {
      const next = new Set(taps);
      const wasFirstView = !next.has(currentSpot.id);
      next.add(currentSpot.id);
      setTaps(next);
      setCurrentSpot(null);
      setVideoExiting(false);
      if (wasFirstView && next.size === CONTENT.spots.length) {
        window.setTimeout(() => setPhase('climax-ready'), 800);
      } else {
        setPhase('idle');
      }
    }, HOLD_AFTER_END_MS);
  }, [currentSpot, taps]);

  const playClimax = useCallback(() => {
    if (phase !== 'climax-ready') return;
    clearTimers();
    setPhase('climax-playing');
    setSubtitleVisible(false);
    if (CONTENT.endingSubtitleKey) {
      subTimerRef.current = window.setTimeout(() => {
        setSubtitleVisible(true);
      }, CLIMAX_SUBTITLE_DELAY_MS);
    }
  }, [phase]);

  const onClimaxEnded = useCallback(() => {
    setPhase('revelation');
    if (CONTENT.endingSubtitleKey) setSubtitleVisible(true);
    holdTimerRef.current = window.setTimeout(() => {
      setPhase('done');
    }, REVELATION_HOLD_MS);
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setTaps(new Set());
    setCurrentSpot(null);
    setSubtitleVisible(false);
    setVideoFallback(false);
    setVideoExiting(false);
    setPhase('idle');
  }, []);

  useEffect(() => () => clearTimers(), []);

  // ── Determine what's on top of the hero right now ──────────────────────
  const showingClimaxVideo = phase === 'climax-playing' || phase === 'revelation';
  const showingClipVideo = (phase === 'playing-clip' || phase === 'holding-subtitle') && currentSpot != null;

  const activeVideoUrl = showingClipVideo && currentSpot
    ? videoUrl(currentSpot.video)
    : showingClimaxVideo
      ? videoUrl(CONTENT.endingVideo)
      : null;

  const activeFallbackFrame = videoFallback && showingClipVideo && currentSpot
    ? stillUrl(currentSpot.endFrame)
    : videoFallback && showingClimaxVideo && CONTENT.endingPoster
      ? stillUrl(CONTENT.endingPoster)
      : null;

  const activeSubtitle =
    subtitleVisible && currentSpot
      ? t(currentSpot.subtitleKey)
      : subtitleVisible && showingClimaxVideo && CONTENT.endingSubtitleKey
        ? t(CONTENT.endingSubtitleKey)
        : null;

  // simulated end for fallback (no real video element)
  useEffect(() => {
    if (!videoFallback) return;
    if (phase === 'playing-clip' || phase === 'holding-subtitle') {
      const id = window.setTimeout(onClipEnded, 3200);
      return () => window.clearTimeout(id);
    }
    if (phase === 'climax-playing') {
      const id = window.setTimeout(onClimaxEnded, 5500);
      return () => window.clearTimeout(id);
    }
  }, [videoFallback, phase, onClipEnded, onClimaxEnded]);

  return (
    <div className="bd-root">
      <div className="bd-stage">
        <img
          src={stillUrl(CONTENT.hero)}
          alt=""
          className="bd-hero"
          draggable={false}
        />

        {/* Video overlay — poster=hero kills the black flash during buffering */}
        {activeVideoUrl && !videoFallback && (
          <video
            ref={videoRef}
            key={activeVideoUrl}
            src={activeVideoUrl}
            poster={stillUrl(CONTENT.hero)}
            className={`bd-video ${videoExiting ? 'is-exiting' : ''}`}
            playsInline
            autoPlay
            preload="auto"
            onEnded={phase === 'climax-playing' ? onClimaxEnded : onClipEnded}
            onError={() => setVideoFallback(true)}
          />
        )}

        {/* Fallback: end-frame image if video unavailable */}
        {activeFallbackFrame && (
          <img
            src={activeFallbackFrame}
            alt=""
            className="bd-video bd-video--fallback"
            draggable={false}
          />
        )}

        {/* Title card + tap hint — visible BEFORE first tap, retires after. */}
        {phase === 'idle' && taps.size === 0 && (
          <>
            <div className="bd-title">
              <div className="bd-title__overline">{t('title.overline')}</div>
              <div className="bd-title__main">{t('title.main')}</div>
              <div className="bd-title__sub">{t('title.sub')}</div>
            </div>
            <div className="bd-firsthint">{t('hint.firstTap')}</div>
          </>
        )}

        {/* Hotspots — rectangular tap areas with a ripple affordance inside */}
        {phase === 'idle' &&
          CONTENT.spots.map((s) => {
            const seen = taps.has(s.id);
            return (
              <div
                key={s.id}
                className={`bd-hot-group ${debug ? 'is-debug' : ''}`}
                style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.width}%`, height: `${s.height}%` }}
              >
                <div
                  className={`bd-ripple ${seen ? 'is-seen' : ''}`}
                  style={{ left: `${s.affordanceX ?? 50}%`, top: `${s.affordanceY ?? 50}%` }}
                >
                  <i />
                </div>
                <button
                  type="button"
                  className="bd-hot"
                  aria-label={t(s.labelKey)}
                  onPointerDown={(e) => { e.stopPropagation(); playClip(s); }}
                />
              </div>
            );
          })}

        {/* Climax cue button — appears when all 5 hotspots have been seen */}
        {phase === 'climax-ready' && (
          <button
            type="button"
            className="bd-cue"
            onPointerDown={playClimax}
            aria-label={t('cue.climax')}
          >
            <span>{t('cue.climax')}</span>
          </button>
        )}

        {/* Subtitle (Wong-Kar-wai-italic, bottom-center) */}
        {activeSubtitle && (
          <div className="bd-subtitle" key={activeSubtitle}>{activeSubtitle}</div>
        )}

        {/* Done — once more button */}
        {phase === 'done' && (
          <div className="bd-after">
            <button
              type="button"
              className="bd-onceMore"
              onPointerDown={(e) => { e.stopPropagation(); reset(); }}
            >
              {t('ui.replay')}
            </button>
          </div>
        )}
      </div>

      {/* Progress strip — visual segments, not interactive */}
      <div className="bd-strip">
        {CONTENT.spots.map((s) => (
          <div key={s.id} className={`bd-strip__seg ${taps.has(s.id) ? 'is-lit' : ''}`} />
        ))}
      </div>
    </div>
  );
}
