// ------------------------------------------------------------------------------------------------

import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";

import {Media} from "../../lib/types";
import {isVideo} from "../../lib/utils";
import {KenBurnsEffect} from "./KenBurnsEffect";
import {MediaComponent} from "./MediaComponent";

// ------------------------------------------------------------------------------------------------

interface MediaWithTransitionProps {
  media: Media;
  duration: number;
  transitionDuration: number;
}

// ------------------------------------------------------------------------------------------------

export const MediaWithTransition: React.FC<MediaWithTransitionProps> = ({media, duration, transitionDuration}) => {
  const frame = useCurrentFrame();

  // Cálculo de opacidade para fade-in e fade-out
  const opacity = interpolate(frame, [0, transitionDuration, duration - transitionDuration, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{opacity}}>
      {isVideo(media.file) ? (
        <MediaComponent media={media} />
      ) : (
        <KenBurnsEffect durationInFrames={duration} direction={media.kenBurnsDirection}>
          <MediaComponent media={media} />
        </KenBurnsEffect>
      )}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------
