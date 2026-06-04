import './ChoiceList.less';

interface Choice {
  id: string;
  label: string;
  visited?: boolean;
  disabled?: boolean;
}

interface Props {
  choices: Choice[];
  onPick: (id: string) => void;
  hint?: string;
}

// Bottom typewriter choice list. Switches to a tighter 2-column layout
// when there are 5+ choices (e.g. ACT 5's six possible last calls) so the
// list doesn't eat the whole screen.
export default function ChoiceList({ choices, onPick, hint }: Props) {
  const compact = choices.length >= 5;
  return (
    <div className={`bd-choices ${compact ? 'is-compact' : ''}`}>
      {hint && <div className="bd-choices__hint">{hint}</div>}
      <ul className="bd-choices__list">
        {choices.map((c) => (
          <li key={c.id}>
            <button
              className={`bd-choices__btn ${c.visited ? 'is-visited' : ''}`}
              disabled={c.disabled}
              onPointerDown={(e) => {
                if (c.disabled) return;
                e.preventDefault();
                e.stopPropagation();
                onPick(c.id);
              }}
            >
              <span className="bd-choices__caret">›</span>
              <span className="bd-choices__label">{c.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
