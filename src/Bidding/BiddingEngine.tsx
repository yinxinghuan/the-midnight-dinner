import { useCallback, useMemo, useState } from 'react';
import './BiddingEngine.less';

import { CONTENT } from './content';
import VideoStage from './primitives/VideoStage';
import HotspotPin from './primitives/HotspotPin';
import EndingCard from './primitives/EndingCard';
import IntroOverlay from './primitives/IntroOverlay';
import type { Phase } from './types';

const BASE = import.meta.env.BASE_URL;
const videoUrl = (rel: string) => BASE + 'videos/' + rel;
const stillUrl = (rel: string) => BASE + 'stills/' + rel;

// Image-percent → viewport-percent for 3:4 hero on 9:19+ phone.
// See [[platform-safe-area-13pct]].
const imageXToViewport = (p: number) => -13 + p * 1.26;

export default function BiddingEngine() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [currentSpotId, setCurrentSpotId] = useState<string | null>(null);

  const heroSrc = useMemo(() => stillUrl(CONTENT.hero), []);
  const endingPosterSrc = CONTENT.endingPoster ? stillUrl(CONTENT.endingPoster) : heroSrc;

  const onBegin = useCallback(() => {
    setPhase('hero');
  }, []);

  const onPinTap = useCallback((spotId: string) => {
    if (visited.has(spotId)) return; // skip already-seen
    setCurrentSpotId(spotId);
    setPhase('playing-clip');
  }, [visited]);

  const onClipEnded = useCallback(() => {
    if (!currentSpotId) return;
    const nowVisited = new Set(visited);
    nowVisited.add(currentSpotId);
    setVisited(nowVisited);
    setCurrentSpotId(null);
    // Decide next phase based on whether all spots are visited.
    if (nowVisited.size >= CONTENT.spots.length) {
      setPhase('ending');
    } else {
      setPhase('hero');
    }
  }, [currentSpotId, visited]);

  const onEndingEnded = useCallback(() => {
    setPhase('ending-card');
  }, []);

  const onReplay = useCallback(() => {
    setVisited(new Set());
    setCurrentSpotId(null);
    setPhase('intro');
  }, []);

  const currentSpot = currentSpotId
    ? CONTENT.spots.find((s) => s.id === currentSpotId) ?? null
    : null;

  const pinView = useMemo(() => {
    return CONTENT.spots.map((s) => ({
      ...s,
      vx: imageXToViewport(s.pinX),
      vy: s.pinY,
      isVisited: visited.has(s.id),
    }));
  }, [visited]);

  return (
    <div className="bd-root">
      <div className="bd-stage">
        <img
          className="bd-hero"
          src={heroSrc}
          alt=""
          draggable={false}
        />

        {/* Hero phase: pins overlaid on the static hero */}
        {phase === 'hero' && (
          <>
            {pinView.map((p) => (
              <HotspotPin
                key={`pin-${p.id}`}
                vx={p.vx}
                vy={p.vy}
                labelKey={p.labelKey}
                onTap={() => onPinTap(p.id)}
                visited={p.isVisited}
              />
            ))}
            <div className="bd-progress">{`${visited.size} / ${CONTENT.spots.length}`}</div>
          </>
        )}

        {/* Spot clip playing on top of hero */}
        {phase === 'playing-clip' && currentSpot && (
          <VideoStage
            key={`clip-${currentSpot.id}`}
            videoSrc={videoUrl(currentSpot.video)}
            posterSrc={heroSrc}
            fallbackImg={heroSrc}
            onEnded={onClipEnded}
            holdMs={200}
          />
        )}

        {/* Final ending video */}
        {phase === 'ending' && (
          <VideoStage
            key="ending-video"
            videoSrc={videoUrl(CONTENT.endingVideo)}
            posterSrc={endingPosterSrc}
            fallbackImg={endingPosterSrc}
            onEnded={onEndingEnded}
            holdMs={400}
          />
        )}

        {/* Ending card */}
        {phase === 'ending-card' && (
          <EndingCard
            type={CONTENT.endingType}
            titleKey={CONTENT.endingTitleKey}
            taglineKey={CONTENT.endingTaglineKey}
            onReplay={onReplay}
          />
        )}

        {/* Intro overlay loops until first tap */}
        {phase === 'intro' && <IntroOverlay onBegin={onBegin} />}
      </div>
    </div>
  );
}
