import {Layout, Rect, Txt} from '@canvas-commons/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  Reference,
  sequence,
  waitFor,
} from '@canvas-commons/core';
import {THEME, valueColor} from './theme';

export interface Slot {
  rect: Reference<Rect>;
  label: Reference<Txt>;
  value: number;
}

export interface BarChartOptions {
  /** Width of a single bar. */
  barWidth?: number;
  /** Gap between bars. */
  gap?: number;
  /** Y position of the baseline (the bottom of every bar). */
  baselineY?: number;
  /** Tallest bar height in px. */
  maxBarHeight?: number;
  /** Shortest bar height in px. */
  minBarHeight?: number;
  /** Show the numeric value above each bar. */
  showLabels?: boolean;
  /** Center X of the whole chart. */
  centerX?: number;
  /** Radius of the rounded tops. */
  radius?: number;
  /** Deep geometry y-offset of the whole chart (for aux lanes). */
  yOffset?: number;
}

/**
 * A bar chart of `values`. Each element owns its bar + label. Elements that
 * change index are moved with an animated `position.x` transition, which keeps
 * the footage legible no matter how elements are reordered.
 */
export class BarChart {
  readonly values: number[];
  readonly n: number;
  readonly maxValue: number;
  readonly group = new Layout({});
  slots: Slot[] = [];

  readonly barWidth: number;
  readonly gap: number;
  readonly baselineY: number;
  readonly maxBarHeight: number;
  readonly minBarHeight: number;
  readonly showLabels: boolean;
  readonly centerX: number;
  readonly radius: number;
  readonly yOffset: number;

  private baseline: Rect;

  constructor(values: number[], opts: BarChartOptions = {}) {
    this.values = values;
    this.n = values.length;
    this.maxValue = Math.max(...values);

    this.barWidth = opts.barWidth ?? 46;
    this.gap = opts.gap ?? 9;
    this.baselineY = opts.baselineY ?? 150;
    this.maxBarHeight = opts.maxBarHeight ?? 430;
    this.minBarHeight = opts.minBarHeight ?? 24;
    this.showLabels = opts.showLabels ?? true;
    this.centerX = opts.centerX ?? 0;
    this.radius = opts.radius ?? 7;
    this.yOffset = opts.yOffset ?? 0;

    // Ground line.
    this.baseline = new Rect({
      x: this.centerX,
      y: this.baselineY,
      width: this.n * this.spacing() + 40,
      height: 3,
      radius: 2,
      fill: THEME.border,
      opacity: 0,
    });
    this.group.add(this.baseline);

    // Build bars.
    for (let i = 0; i < this.n; i++) {
      const v = values[i];
      const height = this.barHeight(v);

      const rect = createRef<Rect>();
      this.group.add(
        <Rect
          ref={rect}
          x={this.slotX(i)}
          y={this.baselineY}
          width={this.barWidth}
          height={height}
          radius={this.radius}
          fill={this.initialColor(v)}
          stroke={THEME.barStroke}
          lineWidth={1.5}
          opacity={0}
        />,
      );

      const label = createRef<Txt>();
      this.group.add(
        <Txt
          ref={label}
          x={this.slotX(i)}
          y={this.baselineY + 26}
          text={String(v)}
          fontSize={20}
          fontWeight={700}
          fill={THEME.textMuted}
          fontFamily={THEME.mono}
          opacity={0}
        />,
      );

      this.slots.push({rect, label, value: v});
    }
  }

  spacing(): number {
    return this.barWidth + this.gap;
  }

  slotX(i: number): number {
    return this.centerX + (i - (this.n - 1) / 2) * this.spacing();
  }

  barHeight(v: number): number {
    const t = this.maxValue > 1 ? (v - 1) / (this.maxValue - 1) : 1;
    return this.minBarHeight + (this.maxBarHeight - this.minBarHeight) * t;
  }

  centerY(v: number): number {
    return this.baselineY - this.barHeight(v) / 2;
  }

  labelY(v: number): number {
    return this.baselineY - this.barHeight(v) - 18;
  }

  private initialColor(v: number): string {
    return valueColor(v, this.maxValue);
  }

  /**
   * Row-level Y offsets translated to actual scene Y positions. When aux
   * lanes are used (merge sort), elements can be moved to a second row.
   */
  auxY(rowY: number): number {
    return rowY;
  }

  /** Rise the bars in from the baseline with class. */
  *appear(duration = 0.6, stagger = 0.045) {
    yield* this.baseline.opacity(1, duration * 0.8);
    yield* sequence(
      stagger,
      ...this.slots.map((s, i) => {
        const v = s.value;
        return all(
          s.rect().opacity(1, duration),
          s.rect().position.y(this.centerY(v), duration),
          s.label().opacity(1, duration),
          s.label().position.y(this.labelY(v), duration),
        );
      }),
    );
  }

  *fadeOut(duration = 0.5) {
    yield* all(
      this.group.opacity(0, duration),
      this.baseline.opacity(0, duration),
    );
  }

  /** Fills every slot with its neutral per-value colour. */
  *resetColors(duration = 0.4) {
    yield* all(
      ...this.slots.map(s =>
        s.rect().fill(this.initialColor(s.value), duration),
      ),
    );
  }

  *resetIndex(i: number, duration = 0.4) {
    yield* this.slots[i].rect().fill(
      this.initialColor(this.slots[i].value),
      duration,
    );
  }

  /** Resets several indices back to their neutral colours in parallel. */
  *resetIndices(indices: number[], duration = 0.3) {
    yield* all(
      ...indices.map(i =>
        this.slots[i].rect().fill(this.initialColor(this.slots[i].value), duration),
      ),
    );
  }

  *colorIndices(indices: number[], color: string, duration = 0.25) {
    yield* all(
      ...indices.map(i => this.slots[i].rect().fill(color, duration)),
    );
  }

  /** Colors a specific set of slot objects (identity-based, position-agnostic). */
  *colorSlots(slots: Slot[], color: string, duration = 0.25) {
    yield* all(...slots.map(s => s.rect().fill(color, duration)));
  }

  /** Colors slots `from..to` (inclusive) with a single colour. */
  *colorRange(from: number, to: number, color: string, duration = 0.35) {
    yield* all(
      ...this.slots.slice(from, to + 1).map(s =>
        s.rect().fill(color, duration),
      ),
    );
  }

  /**
   * Swaps the elements at indices `i` and `j` with a smooth hop.
   * Reorders the internal slot list so indices stay in sync.
   */
  *swap(i: number, j: number, duration = 0.55, hop = 46) {
    if (i === j) {
      yield* waitFor(duration);
      return;
    }
    const a = this.slots[i];
    const b = this.slots[j];
    const xa = this.slotX(i);
    const xb = this.slotX(j);
    const half = duration / 2;

    yield* all(
      a.rect().position.x(xb, duration, easeInOutCubic),
      a.rect().position.y(-hop, half).to(0, half),
      a.label().position.x(xb, duration, easeInOutCubic),
      a.label().position.y(-hop, half).to(0, half),
      b.rect().position.x(xa, duration, easeInOutCubic),
      b.rect().position.y(-hop, half).to(0, half),
      b.label().position.x(xa, duration, easeInOutCubic),
      b.label().position.y(-hop, half).to(0, half),
    );

    [this.slots[i], this.slots[j]] = [this.slots[j], this.slots[i]];
  }

  /**
   * Moves the element at index `from` to index `to`, shifting everything
   * between `to..from` one step to the right. Used by insertion sort.
   */
  *shiftIntoPlace(from: number, to: number, duration = 0.6, lift = 96) {
    if (from === to) {
      yield* this.slots[from].rect().fill(THEME.found, 0.2);
      yield* waitFor(duration);
      yield* this.resetIndex(from, 0.3);
      return;
    }
    const moving = this.slots[from];
    const liftDur = duration * 0.35;

    // Pull the card out.
    yield* all(
      moving.rect().position.y(-lift, liftDur),
      moving.label().position.y(-lift - 2, liftDur),
      moving.rect().fill(THEME.found, liftDur),
      moving.label().fill(THEME.found, liftDur),
    );

    // Shift neighbours right while the card glides into its slot.
    const shifted = [];
    for (let i = from - 1; i >= to; i--) {
      shifted.push({slot: this.slots[i], x: this.slotX(i + 1)});
    }
    yield* all(
      ...shifted.flatMap(({slot, x}) => [
        slot.rect().position.x(x, duration),
        slot.label().position.x(x, duration),
      ]),
      moving.rect().position.x(this.slotX(to), duration),
      moving.label().position.x(this.slotX(to), duration),
    );

    // Drop the card back down.
    yield* all(
      moving.rect().position.y(0, liftDur),
      moving.label().position.y(0, liftDur),
    );

    // Reorder internal slots.
    const [el] = this.slots.splice(from, 1);
    this.slots.splice(to, 0, el);
  }

  /**
   * Flies an element to an arbitrary absolute position on the row with
   * baseline `rowY` (elements stand on the baseline). Does not touch the
   * internal slot ordering by itself — use `spliceOut` / `spliceIn` for that.
   */
  *fly(slot: Slot, x: number, rowY: number, duration = 0.5) {
    const v = slot.value;
    const barY = rowY - this.barHeight(v) / 2;
    const labelTop = rowY - this.barHeight(v) - 18;
    yield* all(
      slot.rect().position.x(x, duration, easeInOutCubic),
      slot.rect().position.y(barY, duration, easeInOutCubic),
      slot.label().position.x(x, duration, easeInOutCubic),
      slot.label().position.y(labelTop, duration, easeInOutCubic),
    );
  }

  /**
   * Removes the element currently at index `i` from the main row, returning
   * it. The animation is the caller’s job (usually `fly`).
   */
  spliceOut(i: number): Slot {
    const [slot] = this.slots.splice(i, 1);
    return slot;
  }

  /**
   * Inserts an element into the main row at logical index `i`, shifting
   * everything from `i` onward one slot across. The element is expected at
   * roughly its destination before this runs (a small closing glide is
   * animated).
   */
  *spliceIn(slot: Slot, i: number, duration = 0.3) {
    const shifted = this.slots.slice(i).map((s, k) => ({
      slot: s,
      x: this.slotX(i + k + 1),
    }));
    yield* all(
      ...shifted.flatMap(({slot, x}) => [
        slot.rect().position.x(x, duration),
        slot.label().position.x(x, duration),
      ]),
      slot.rect().position.x(this.slotX(i), duration),
      slot.label().position.x(this.slotX(i), duration),
    );
    this.slots.splice(i, 0, slot);
  }

  /** Instant, unanimated internal reorder (kept for determinism calls). */
  spliceIndex(i: number, slot: Slot) {
    this.slots.splice(i, 0, slot);
  }

  /**
   * Places `slot` (already at the target x/y) at logical index `at`, shifting
   * the buffered elements between its current and target index one step
   * across so the internal ordering stays aligned with their x positions.
   */
  *placeMerge(slot: Slot, at: number, duration = 0.2) {
    const from = this.slots.indexOf(slot);
    if (from < 0 || from === at) {
      yield* waitFor(0.001);
      return;
    }
    const animations = [];
    if (from > at) {
      for (let k = at; k < from; k++) {
        const s = this.slots[k];
        animations.push(s.rect().position.x(this.slotX(k + 1), duration));
        animations.push(s.label().position.x(this.slotX(k + 1), duration));
      }
      yield* all(...animations);
      this.slots.splice(from, 1);
      this.slots.splice(at, 0, slot);
    } else {
      for (let k = from + 1; k <= at; k++) {
        const s = this.slots[k];
        animations.push(s.rect().position.x(this.slotX(k - 1), duration));
        animations.push(s.label().position.x(this.slotX(k - 1), duration));
      }
      yield* all(...animations);
      this.slots.splice(from, 1);
      this.slots.splice(at - 1, 0, slot);
    }
  }

  /** Turns every bar (and label) green in a satisfying left→right sweep. */
  *sortedSweep(color = THEME.sorted, perBar = 0.05, stagger = 0.02) {
    yield* sequence(
      stagger,
      ...this.slots.map(s =>
        all(
          s.rect().fill(color, perBar),
          s.rect().scale(1.07, perBar).to(1, perBar),
          s.label().fill(color, perBar),
        ),
      ),
    );
  }
}