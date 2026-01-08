"use client";
import { Easing, continueRender, delayRender, useCurrentFrame } from "remotion"
import { interpolate, interpolateColors } from "remotion"
import React, { useLayoutEffect, useState } from "react"
import {
  calculateTransitions,
  getStartingSnapshot,
  TokenTransition,
  TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions"
import {
  AnnotationHandler,
  HighlightedCode,
  InnerPre,
  InnerToken,
} from "codehike/code"

export function useTokenTransitions(
  oldCode: HighlightedCode | undefined,
  newCode: HighlightedCode,
  durationInFrames: number
) {
  const frame = useCurrentFrame()
  const ref = React.useRef<HTMLPreElement>(null)
  const [snapshot, setSnapshot] = useState<TokenTransitionsSnapshot>()
  const [transitions, setTransitions] = useState<TokenTransition[]>()
  const [handle] = useState(() => delayRender())
  const [hasError, setHasError] = useState(false)

  // if no old code, we transition from empty code
  const prevCode = oldCode || { ...newCode, tokens: [], annotations: [] }

  useLayoutEffect(() => {
    if (hasError) {
      continueRender(handle)
      return
    }

    // Phase 1: Snapshot the old code layout
    if (!snapshot) {
      if (ref.current) {
        try {
          setSnapshot(getStartingSnapshot(ref.current))
        } catch (e) {
          console.error("Snapshot failed:", e)
          setHasError(true)
          continueRender(handle)
        }
      } else {
          // No ref yet
      }
      return
    }

    // Phase 2: Calculate transitions to new code layout
    if (!transitions) {
      if (ref.current) {
        try {
          const t = calculateTransitions(ref.current, snapshot)
          setTransitions(t)
        } catch (e) {
          console.error("Transition calculation failed:", e)
          setHasError(true)
          continueRender(handle)
        }
      }
      return
    }

    // Phase 3: Animate
    try {
      transitions.forEach(({ element, keyframes, options }) => {
        interpolateStyle(
          element,
          keyframes,
          frame,
          durationInFrames * options.delay,
          durationInFrames * options.duration
        )
      })
    } catch (e) {
      console.error("Interpolation failed:", e)
    }
    continueRender(handle)
  }, [snapshot, transitions, frame, durationInFrames, handle, hasError])

  const code = (snapshot || hasError) ? newCode : prevCode

  return { code, ref }
}

export const tokenTransitions: AnnotationHandler = {
  name: "token-transitions",
  Pre: (props) => <InnerPre merge={props} style={{ position: "relative" }} />,
  Token: (props) => (
    <InnerToken merge={props} style={{ display: "inline-block" }} />
  ),
}

function interpolateStyle(
  element: HTMLElement,
  keyframes: TokenTransition["keyframes"],
  frame: number,
  delay: number,
  duration: number
) {
  const { translateX, translateY, color, opacity } = keyframes

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  })

  if (opacity) {
    element.style.opacity = interpolate(progress, [0, 1], opacity).toString()
  }
  if (color) {
    element.style.color = interpolateColors(progress, [0, 1], color)
  }
  if (translateX || translateY) {
    const x = interpolate(progress, [0, 1], translateX!)
    const y = interpolate(progress, [0, 1], translateY!)
    element.style.translate = `${x}px ${y}px`
  }
}