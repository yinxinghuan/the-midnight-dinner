import { useEffect, useRef, useState } from 'react';
import './VideoStage.less';

interface Props {
  videoSrc: string;
  posterSrc: string;
  fallbackImg?: string;
  onEnded: () => void;
  // After the video's native 'ended' event, hold on the last frame this many
  // ms before calling `onEnded`. The engine then unmounts VideoStage and the
  // bd-hero img (which has just been swapped to the freeze frame matching the
  // video's last frame) takes over. No fade — snap-cut, invisible because the
  // bd-hero img is pixel-identical to the held last frame.
  holdMs?: number;
}

export default function VideoStage({
  videoSrc, posterSrc, fallbackImg, onEnded, holdMs = 250,
}: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [errored, setErrored] = useState(false);
  const endTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const v = ref.current; if (!v) return;
    const handleEnded = () => {
      endTimerRef.current = window.setTimeout(onEnded, holdMs);
    };
    const handleError = () => { setErrored(true); window.setTimeout(onEnded, 1500); };
    v.addEventListener('ended', handleEnded);
    v.addEventListener('error', handleError);
    v.play().catch(() => {});
    return () => {
      v.removeEventListener('ended', handleEnded);
      v.removeEventListener('error', handleError);
      if (endTimerRef.current) window.clearTimeout(endTimerRef.current);
    };
  }, [videoSrc, holdMs, onEnded]);

  if (errored && fallbackImg) {
    return <img className="bd-vstage bd-vstage--fallback" src={fallbackImg} alt="" />;
  }

  return (
    <video
      ref={ref}
      className="bd-vstage"
      src={videoSrc}
      poster={posterSrc}
      autoPlay
      playsInline
      preload="auto"
    />
  );
}
