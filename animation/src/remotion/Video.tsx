import React from "react"
import {
  AbsoluteFill,
  Sequence,
  interpolateColors,
  useCurrentFrame,
} from "remotion"
import { InnerLine, Pre } from "codehike/code"
import { tokenTransitions, useTokenTransitions } from "./token-transitions"

export const STEP_FRAMES = 60;

export type Step = {
    title: string;
    code: any;
}

export function Video({ steps }: { steps: Step[] }) {
    if (!steps || steps.length === 0) return <AbsoluteFill style={{background: "#0D1117"}}/>;
    
    const themeBackground = steps[0]?.code?.style?.background || "#0D1117";
    const themeColor = steps[0]?.code?.style?.color || "#c9d1d9";

  return (
    <AbsoluteFill
      style={{
        background: themeBackground,
        color: themeColor,
        // Remove center alignment here to let the inner div handle it
        fontSize: 24,
      }}
    >
      {steps.map((step, index) => (
        <Sequence
          key={index}
          from={STEP_FRAMES * index}
          durationInFrames={STEP_FRAMES}
        >
            <div style={{padding: 80, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                <h1 style={{fontSize: 40, marginBottom: 20}}>{step.title}</h1>
                <div style={{fontSize: 24}}>
                    <Code oldCode={steps[index - 1]?.code} newCode={step.code} />
                </div>
            </div>
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

function Code({ oldCode, newCode }: { oldCode: any, newCode: any }) {
  const { code, ref } = useTokenTransitions(oldCode, newCode, STEP_FRAMES)
  return <Pre ref={ref} code={code} handlers={[mark, tokenTransitions]} />
}

const mark = {
  name: "mark",
  Line: (props: any) => <InnerLine merge={props} style={{ padding: "0 4px" }} />,
  Block: ({ children, annotation }: any) => {
    const delay = +(annotation.query || 0)
    const frame = useCurrentFrame()
    const background = interpolateColors(
      frame,
      [delay, delay + 10],
      ["#0000", "#F2CC6044"]
    )

    return <div style={{ background }}>{children}</div>
  },
}
