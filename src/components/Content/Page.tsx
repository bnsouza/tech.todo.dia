// ------------------------------------------------------------------------------------------------

import React from "react";
import {makeTransform, scale, translateY} from "@remotion/animation-utils";
import {TikTokPage} from "@remotion/captions";
import {fitText} from "@remotion/layout-utils";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

import {Font} from "../../lib/load-font";

// ------------------------------------------------------------------------------------------------

const fontFamily = Font;

const container: React.CSSProperties = {
  justifyContent: "start",
  alignItems: "center",
  textAlign: "center",
  top: undefined,
  bottom: -300,
  height: 220,
};

const DESIRED_FONT_SIZE = 80;
const HIGHLIGHT_COLOR = "#F5F500";

// ------------------------------------------------------------------------------------------------

export const Page: React.FC<{
  enterProgress: number;
  page: TikTokPage;
}> = ({enterProgress, page}) => {
  const frame = useCurrentFrame();
  const {width, fps} = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const fittedText = fitText({
    fontFamily,
    text: page.text,
    withinWidth: width,
  });

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontSize,
          color: "white",
          WebkitTextStroke: "14px black",
          paintOrder: "stroke",
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
            translateY(interpolate(enterProgress, [0, 1], [50, 0])),
          ]),
          fontFamily,
          textTransform: "uppercase",
        }}>
        <span
          style={{
            transform: makeTransform([
              scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
              translateY(interpolate(enterProgress, [0, 1], [50, 0])),
            ]),
          }}>
          {page.tokens.map((t) => {
            const startRelativeToSequence = t.fromMs - page.startMs;
            const endRelativeToSequence = t.toMs - page.startMs;

            const active = startRelativeToSequence <= timeInMs && endRelativeToSequence > timeInMs;

            return (
              <span
                key={t.fromMs}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  color: active ? HIGHLIGHT_COLOR : "white",
                }}
                className="tracking-tighter">
                {t.text}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------
