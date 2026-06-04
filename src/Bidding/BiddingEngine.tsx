import { useCallback, useMemo, useState } from 'react';
import './BiddingEngine.less';

import { CONTENT } from './content';
import { t } from './i18n';
import VideoStage from './primitives/VideoStage';
import HotspotPin from './primitives/HotspotPin';
import ChoiceList from './primitives/ChoiceList';
import SceneTitle from './primitives/SceneTitle';
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
    if (visited.has(spotId)) return; // already seen
    setCurrentSpotId(spotId);
    setPhase('playing-clip');
  }, [visited]);

  const onClipEnded = useCallback(() => {
    if (!currentSpotId) return;
    const nowVisited = new Set(visited);
    nowVisited.add(currentSpotId);
    setVisited(nowVisited);
    setCurrentSpotId(null);
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

  const choices = useMemo(() => {
    return CONTENT.spots.map((s) => ({
      id: s.id,
      label: t(s.labelKey),
      visited: visited.has(s.id),
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

        {/* Hero phase: chrome + pins + bottom choice list */}
        {phase === 'hero' && (
          <>
            <SceneTitle
              cycleKey="hero"
              primary={t('scene.title')}
              secondary={t('scene.secondary')}
              meta={t('ui.progress', { n: visited.size })}
            />
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
            <ChoiceList
              choices={choices}
              onPick={onPinTap}
              hint={t('scene.hint')}
            />
          </>
        )}

        {/* Clip playing — subtitle is the i18n string for this spot */}
        {phase === 'playing-clip' && currentSpot && (
          <VideoStage
            key={`clip-${currentSpot.id}`}
            videoSrc={videoUrl(currentSpot.video)}
            posterSrc={heroSrc}
            fallbackImg={heroSrc}
            onEnded={onClipEnded}
            holdMs={1200}
            subtitle={t(`subtitle.${currentSpot.id}`)}
          />
        )}

        {/* Ending video — silhouette stands and resolves into 50yo */}
        {phase === 'ending' && (
          <VideoStage
            key="ending-video"
            videoSrc={videoUrl(CONTENT.endingVideo)}
            posterSrc={endingPosterSrc}
            fallbackImg={endingPosterSrc}
            onEnded={onEndingEnded}
            holdMs={1500}
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
