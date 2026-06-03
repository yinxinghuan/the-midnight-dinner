import { t } from '../i18n';
import './IntroOverlay.less';

interface Props {
  onBegin: () => void;
}

// Intro overlay that sits over the root_start backdrop and loops the title
// + tap hint until the player taps. CLAUDE.md rule: TikTok-style preloaded
// games need a looping intro, never a one-shot. So the hint pulses forever.
export default function IntroOverlay({ onBegin }: Props) {
  return (
    <button
      className="bd-intro"
      onPointerDown={(e) => {
        e.preventDefault();
        onBegin();
      }}
    >
      <div className="bd-intro__inner">
        <div className="bd-intro__series">AlterU · After Dark</div>
        <h1 className="bd-intro__title">{t('intro.title')}</h1>
        <div className="bd-intro__rule" />
        <div className="bd-intro__hint">{t('intro.hint')}</div>
        <div className="bd-intro__cta">
          <span className="bd-intro__cta-dot" />
          <span className="bd-intro__cta-label">{t('intro.cta')}</span>
        </div>
      </div>
    </button>
  );
}
