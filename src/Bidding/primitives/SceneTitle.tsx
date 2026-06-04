import { ReactNode } from 'react';
import './SceneTitle.less';

interface Props {
  primary: string;
  secondary?: string;
  meta?: string;
  // optional examines row rendered INLINE at the bottom of the title block,
  // so document affordances are grouped with the header instead of floating
  // in the middle of the page.
  examines?: ReactNode;
  cycleKey: string | number;
}

// Editorial scene header: serif italic primary, hairline rule, sans-serif
// secondary, typewriter meta stamp, and (optionally) the document affordances
// inline at the bottom of the same block. Soft top-down gradient backdrop.
export default function SceneTitle({ primary, secondary, meta, examines, cycleKey }: Props) {
  return (
    <div key={cycleKey} className="bd-scenetitle">
      <div className="bd-scenetitle__inner">
        <div className="bd-scenetitle__primary">{primary}</div>
        <div className="bd-scenetitle__rule" aria-hidden />
        {secondary && <div className="bd-scenetitle__secondary">{secondary}</div>}
        {meta && <div className="bd-scenetitle__meta">{meta}</div>}
        {examines && <div className="bd-scenetitle__examines">{examines}</div>}
      </div>
    </div>
  );
}
