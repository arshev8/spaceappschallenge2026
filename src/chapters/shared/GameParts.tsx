import { useId, type ReactNode } from 'react';

/** One numbered stage of a mini-game. Locked stages are inert until the previous step is done. */
export function Stage({
  number,
  title,
  done,
  locked = false,
  lockedText,
  children,
}: {
  number: number;
  title: string;
  done: boolean;
  locked?: boolean;
  lockedText?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section className={`ec-stage${done ? ' is-done' : ''}${locked ? ' is-locked' : ''}`} aria-labelledby={id}>
      <div className="ec-stage-head">
        <span className="ec-stage-num" aria-hidden="true">{done ? '✓' : number}</span>
        <h4 id={id}>
          <span className="ec-visually-hidden">Step {number}: </span>
          {title}
          {done && <span className="ec-stage-done"> · Done</span>}
        </h4>
      </div>
      {locked && lockedText && <p className="ec-locked-note">{lockedText}</p>}
      <div className="ec-stage-body" inert={locked || undefined}>
        {children}
      </div>
    </section>
  );
}

export type SimpleChoice = { id: string; label: string };

/** Accessible radio-card list. Works with keyboard arrows like any radio group. */
export function ChoiceList({
  name,
  legend,
  choices,
  value,
  onChange,
  disabled = false,
  mono = false,
}: {
  name: string;
  legend: ReactNode;
  choices: SimpleChoice[];
  value: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
  mono?: boolean;
}) {
  const uid = useId();
  return (
    <fieldset className="ec-fieldset" disabled={disabled}>
      <legend>{legend}</legend>
      <ul className={`ec-choice-list${mono ? ' ec-choice-list--mono' : ''}`}>
        {choices.map((c) => (
          <li key={c.id}>
            <label className="ec-choice">
              <input type="radio" name={`${name}-${uid}`} value={c.id} checked={value === c.id} onChange={() => onChange(c.id)} />
              <span className="ec-choice-text">
                <strong>{c.label}</strong>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

/**
 * Feedback that never relies on color alone: icon + word + explanation.
 * The live region is always mounted so screen readers announce changes; pass
 * falsy children to show nothing.
 */
export function Feedback({ ok, children, okTag = 'Correct', tryTag = 'Not yet — try again' }: { ok: boolean; children?: ReactNode; okTag?: string; tryTag?: string }) {
  return (
    <div aria-live="polite" className="ec-feedback-wrap">
      {children ? (
        <p className={`ec-feedback ${ok ? 'ec-feedback--ok' : 'ec-feedback--try'}`}>
          <span className="ec-feedback-tag">
            <span aria-hidden="true">{ok ? '✓ ' : '↻ '}</span>
            {ok ? okTag : tryTag}
          </span>
          {children}
        </p>
      ) : null}
    </div>
  );
}
