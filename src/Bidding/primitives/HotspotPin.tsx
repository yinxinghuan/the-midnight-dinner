import { t } from '../i18n';
import './HotspotPin.less';

interface Props {
  // Position in image-percent (0-100); engine maps to viewport via `-13 + p × 1.26`.
  // We accept viewport-percent here (already mapped).
  vx: number;
  vy: number;
  labelKey: string;
  onTap: () => void;
  visited?: boolean;
}

export default function HotspotPin({ vx, vy, labelKey, onTap, visited }: Props) {
  return (
    <button
      className={`bd-pin ${visited ? 'is-visited' : ''}`}
      style={{ left: `${vx}%`, top: `${vy}%` }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onTap();
      }}
    >
      <span className="bd-pin__dot" />
      <span className="bd-pin__ring" />
      <span className="bd-pin__label">{t(labelKey)}</span>
    </button>
  );
}
