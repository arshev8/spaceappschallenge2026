import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Apollo11 from '../apollo11';
import Opportunity from '../opportunity';
import InSight from '../insight';
import Voyager from '../voyager';

beforeEach(() => {
  // Reduced motion makes the laser pulse resolve instantly.
  document.documentElement.setAttribute('data-reduce-motion', 'true');
});
afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-reduce-motion');
});

const next = () => {
  const nav = screen.getByRole('navigation', { name: 'Previous and next step' });
  const buttons = within(nav).getAllByRole('button');
  return buttons[buttons.length - 1] as HTMLButtonElement;
};
const advance = (n: number) => { for (let i = 0; i < n; i++) fireEvent.click(next()); };

function finish(onComplete: ReturnType<typeof vi.fn>, label: string) {
  expect(onComplete).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: label }));
  expect(onComplete).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('button', { name: label })).toBeNull();
  expect(screen.getByText('Discovery added to your journal.')).toBeTruthy();
}

describe('mini-games are fully playable with keyboard-operable controls', () => {
  it('Apollo 11: aim, fire, calculate', () => {
    const onComplete = vi.fn();
    const onBack = vi.fn();
    render(<Apollo11 onComplete={onComplete} onBack={onBack} />);
    expect(onComplete).not.toHaveBeenCalled();
    advance(2);
    expect(screen.getByRole('heading', { name: 'Measure the distance to the Moon' })).toBeTruthy();
    expect(next().disabled).toBe(true);
    fireEvent.click(screen.getByLabelText('Bare lunar ground beside it'));
    expect(screen.getByText(/Not yet — try again/)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('The Apollo 11 reflector array'));
    fireEvent.click(screen.getByRole('button', { name: 'Fire laser pulse' }));
    expect(screen.getByText(/Return detected! Shot 1/)).toBeTruthy();
    expect(screen.getByRole('table', { name: /Measurement log/ })).toBeTruthy();
    expect(screen.getByRole('list', { name: 'Measurement sequence' })).toBeTruthy();
    fireEvent.click(screen.getByLabelText('distance = speed of light × time ÷ 2'));
    expect(screen.getByText(/matches the 384,400 km you set/)).toBeTruthy();
    expect(next().disabled).toBe(false);
    advance(2);
    finish(onComplete, 'Add discovery to journal');
    fireEvent.click(screen.getByRole('button', { name: 'Return to the atlas' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('Opportunity: sort the evidence, then explore the dust model', () => {
    const onComplete = vi.fn();
    render(<Opportunity onComplete={onComplete} onBack={() => {}} />);
    advance(2);
    const decide = (sample: string, verdict: string) => {
      fireEvent.click(screen.getAllByRole('button', { name: new RegExp(sample) }).find(b => b.classList.contains('ec-evidence-item'))!);
      fireEvent.click(screen.getByRole('button', { name: verdict, pressed: false }));
    };
    decide('Tiny round spheres', 'Supports ancient water');
    expect(screen.getByText(/NASA listed more than one way/)).toBeTruthy();
    decide('Tiny round spheres', 'Not a water clue on its own');
    decide('Hematite at the landing site', 'Supports ancient water');
    decide('Jarosite in the', 'Supports ancient water');
    decide('Rocks at Endeavour Crater', 'Supports ancient water');
    decide('The small crater where it landed', 'Not a water clue on its own');
    expect(screen.getByText('Case closed')).toBeTruthy();
    expect(next().disabled).toBe(true);
    fireEvent.change(screen.getByLabelText(/How dusty is the sky/), { target: { value: '8' } });
    expect(screen.getByText(/fell silent/)).toBeTruthy();
    expect(next().disabled).toBe(false);
    advance(2);
    finish(onComplete, 'Add discovery to journal');
  });

  it('InSight: find the event, reason about arrivals and layers', () => {
    const onComplete = vi.fn();
    render(<InSight onComplete={onComplete} onBack={() => {}} />);
    advance(2);
    expect(screen.getAllByText(/not real NASA/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('table', { name: /Signal summary/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: /^Trace C/ }));
    fireEvent.click(screen.getByRole('radio', { name: /^Trace B/ }));
    fireEvent.click(screen.getByLabelText('Farther away'));
    fireEvent.click(screen.getByRole('button', { name: 'Mantle' }));
    fireEvent.click(screen.getByLabelText(/Where the boundaries between layers are/));
    expect(next().disabled).toBe(false);
    advance(2);
    finish(onComplete, 'Add discovery to journal');
  });

  it('Voyager: match statuses, explore the Golden Record, finish the epilogue', () => {
    const onComplete = vi.fn();
    render(<Voyager onComplete={onComplete} onBack={() => {}} />);
    advance(2);
    const answers = { 'Apollo 11 laser reflector': 'passive-still-useful', 'Opportunity rover': 'mission-ended', 'InSight lander': 'mission-ended', 'Voyager 1': 'extended-mission' };
    for (const [label, value] of Object.entries(answers)) fireEvent.change(screen.getByLabelText(label, { selector: 'select' }), { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }));
    expect(screen.getByText('All four!')).toBeTruthy();
    advance(1);
    expect(screen.getByText('Greetings')).toBeTruthy();
    advance(1);
    finish(onComplete, 'Finish the journey');
  });

  it('marks imagined narration clearly', () => {
    render(<Opportunity onComplete={() => {}} onBack={() => {}} />);
    expect(screen.getByText('Imagined narration based on NASA mission records')).toBeTruthy();
  });
});
