import {Layout, Line, Polygon, Rect, Txt} from '@canvas-commons/2d';
import {Reference} from '@canvas-commons/core';
import {THEME} from '../lib/theme';

interface CounterProps {
  label: string;
  value?: number | string;
  ref?: Reference<Txt>;
  compact?: boolean;
}

export function Counter({label, value, ref, compact}: CounterProps) {
  return (
    <Layout layout direction="row" gap={10} alignItems="baseline">
      <Txt
        text={label}
        fontSize={compact ? 18 : 20}
        fill={THEME.textMuted}
        fontFamily={THEME.sans}
      />
      <Txt
        ref={ref}
        text={String(value ?? 0)}
        fontSize={compact ? 22 : 26}
        fontWeight={700}
        fill={THEME.text}
        fontFamily={THEME.mono}
      />
    </Layout>
  );
}

interface BigOBadgeProps {
  bigO: string;
  accent?: string;
  fontSize?: number;
  ref?: Reference<Rect>;
}

export function BigOBadge({bigO, accent, fontSize, ref}: BigOBadgeProps) {
  return (
    <Layout layout direction="row" gap={14} alignItems="center">
      <Txt
        text={'BIG O'}
        fontSize={(fontSize ?? 28) * 0.6}
        letterSpacing={4}
        fill={THEME.textFaint}
        fontFamily={THEME.mono}
      />
      <Rect
        ref={ref}
        layout
        padding={16}
        radius={12}
        fill={THEME.surface}
        stroke={accent ?? THEME.accent}
        lineWidth={2}
        shadowColor={accent ?? THEME.accent}
        shadowBlur={22}
      >
        <Txt
          text={bigO}
          fontSize={fontSize ?? 56}
          fontWeight={700}
          fill={accent ?? THEME.accent}
          fontFamily={THEME.mono}
        />
      </Rect>
    </Layout>
  );
}

export interface HudProps {
  title: string;
  bigO: string;
  tagline?: string;
  accent: string;
  counterPatch?: {
    comparisons: Reference<Txt>;
    swaps: Reference<Txt>;
  };
}

/**
 * Scene header: algorithm name + big-O badge on the left, live counters on
 * the right. Wrap it in a Layout ref if you want to animate it in.
 */
export function Hud({title, bigO, tagline, accent, counterPatch}: HudProps) {
  return (
    <Layout
      layout
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width={1720}
      height={120}
      padding={30}
    >
      <Layout layout direction="row" gap={30} alignItems="center">
        <Rect
          layout
          direction="column"
          gap={8}
          padding={20}
          radius={16}
          fill={THEME.surface}
          stroke={THEME.border}
          lineWidth={1.5}
        >
          <Txt
            text={title}
            fontSize={44}
            fontWeight={800}
            fill={THEME.text}
            fontFamily={THEME.sans}
          />
          {tagline ? (
            <Txt
              text={tagline}
              fontSize={22}
              fill={THEME.textMuted}
              fontFamily={THEME.sans}
            />
          ) : null}
        </Rect>
        <BigOBadge bigO={bigO} accent={accent} fontSize={52} />
      </Layout>
      {counterPatch ? (
        <Layout layout direction="column" gap={10} alignItems="end">
          <Counter label="comparisons" ref={counterPatch.comparisons} />
          <Counter label="swaps / writes" ref={counterPatch.swaps} />
        </Layout>
      ) : null}
    </Layout>
  );
}

interface PointerProps {
  x: number;
  y: number;
  color?: string;
  size?: number;
  ref?: Reference<Polygon>;
  label?: string;
  labelRef?: Reference<Txt>;
  opacity?: number;
  labelOffset?: number;
}

/** A down-pointing triangle marker used for pivots, pointers and comparisons. */
export function Pointer({
  x,
  y,
  color,
  size,
  ref,
  label,
  labelRef,
  opacity,
  labelOffset,
}: PointerProps) {
  const s = size ?? 24;
  const dist = s * 0.7 + (labelOffset ?? 14);
  return (
    <>
      <Polygon
        ref={ref}
        x={x}
        y={y}
        sides={3}
        size={s * 2.2}
        rotation={180}
        fill={color ?? THEME.compare}
        opacity={opacity ?? 1}
      />
      {label ? (
        <Txt
          ref={labelRef}
          x={x}
          y={y - dist}
          text={label}
          fontSize={20}
          fontWeight={600}
          fill={color ?? THEME.compare}
          fontFamily={THEME.mono}
          opacity={opacity ?? 1}
        />
      ) : null}
    </>
  );
}

/** A vertical pass-boundary line used by bubble/selection sort. */
export function PassLine({
  x,
  ref,
  color,
}: {
  x: number;
  ref?: Reference<Line>;
  color?: string;
}) {
  return (
    <Line
      ref={ref}
      points={[
        [x, -350],
        [x, 190],
      ]}
      stroke={color ?? THEME.textFaint}
      lineWidth={2}
      lineDash={[8, 8]}
      opacity={0}
    />
  );
}

export {Rect, Txt, Layout};