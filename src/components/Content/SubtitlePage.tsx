// ------------------------------------------------------------------------------------------------

import {TikTokPage} from "@remotion/captions";
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";

import {Page} from "./Page";

// ------------------------------------------------------------------------------------------------

export default function SubtitlePage({page}: {page: TikTokPage}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    durationInFrames: 5,
  });

  return (
    <AbsoluteFill>
      <Page enterProgress={enter} page={page} />
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------------------------------------
