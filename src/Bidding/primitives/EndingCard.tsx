import { t } from '../i18n';
import type { EndingType } from '../types';
import './EndingCard.less';

interface Props {
  type: EndingType;
  titleKey: string;
  taglineKey: string;
  onReplay: () => void;
}

export default function EndingCard({ type, titleKey, taglineKey, onReplay }: Props) {
  return (
    <div className={`bd-ending bd-ending--${type}`}>
      <div className="bd-ending__inner">
        <div className="bd-ending__label">{t('ui.ending_label')}</div>
        <h2 className="bd-ending__title">{t(titleKey)}</h2>
        <div className="bd-ending__rule" />
        <div className="bd-ending__tagline">{t(taglineKey)}</div>
        <div className="bd-ending__type">
          {type === 'sensual' ? t('ui.sensual_label') : t('ui.horror_label')}
        </div>
        <button
          className="bd-ending__replay"
          onPointerDown={(e) => {
            e.preventDefault();
            onReplay();
          }}
        >
          {t('ui.replay')}
        </button>
        <div className="bd-ending__sig">{t('ui.brand_sig')}</div>
      </div>
    </div>
  );
}
