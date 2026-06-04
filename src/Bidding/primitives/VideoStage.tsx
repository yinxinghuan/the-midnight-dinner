import { useEffect, useRef, useState } from 'react';
import './VideoStage.less';

interface Props {
  videoSrc: string;
  posterSrc: string;
  fallbackImg?: string;
  onEnded: () => void;
  holdMs?: number;
  // Subtitle for any spoken dialogue in this video. Fades in 900ms after
  // playback starts and stays through the fade-out at the end.
  subtitle?: string;
}

const FADE_MS = 700;
const SUBTITLE_DELAY_MS = 900;

export default function VideoStage({
  videoSrc, posterSrc, fallbackImg,
  onEnded, holdMs = 1800, subtitle,
}: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [exiting, setExiting] = useState(false);
  const [errored, setErrored] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  const endTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const subTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const v = ref.current; if (!v) return;
    const handleEnded = () => {
      endTimerRef.current = window.setTimeout(() => {
        setExiting(true);
        fadeTimerRef.current = window.setTimeout(onEnded, FADE_MS);
      }, holdMs);
    };
    const handleError = () => { setErrored(true); window.setTimeout(onEnded, 1800); };
    v.addEventListener('ended', handleEnded);
    v.addEventListener('error', handleError);
    v.play().catch(() => {});
    if (subtitle) {
      subTimerRef.current = window.setTimeout(
        () => setSubtitleVisible(true),
        SUBTITLE_DELAY_MS,
      );
    }
    return () => {
      v.removeEventListener('ended', handleEnded);
      v.removeEventListener('error', handleError);
      if (endTimerRef.current) window.clearTimeout(endTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      if (subTimerRef.current) window.clearTimeout(subTimerRef.current);
    };
  }, [videoSrc, holdMs, onEnded, subtitle]);

  if (errored && fallbackImg) {
    return (
      <>
        <img className="bd-vstage bd-vstage--fallback" src={fallbackImg} alt="" />
        {subtitle && subtitleVisible && (
          <div className={`bd-vstage__subtitle ${exiting ? 'is-exiting' : ''}`}>{subtitle}</div>
        )}
      </>
    );
  }

  return (
    <>
      <video
        ref={ref}
        className={`bd-vstage ${exiting ? 'is-exiting' : ''}`}
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        playsInline
        preload="auto"
      />
      {subtitle && subtitleVisible && (
        <div className={`bd-vstage__subtitle ${exiting ? 'is-exiting' : ''}`}>{subtitle}</div>
      )}
    </>
  );
}
