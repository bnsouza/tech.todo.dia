// ------------------------------------------------------------------------------------------------

import React from "react";
import {interpolate, useCurrentFrame} from "remotion";

import {KenBurnsDirection} from "../../lib/types";

// ------------------------------------------------------------------------------------------------

interface KenBurnsEffectProps {
  children: React.ReactNode;
  durationInFrames: number;
  direction?: KenBurnsDirection;
}

// ------------------------------------------------------------------------------------------------

export const KenBurnsEffect: React.FC<KenBurnsEffectProps> = ({children, durationInFrames, direction = "none"}) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  const scale = interpolate(progress, [0, 1], [1, 1.2]);

  let translateX = 0;
  let translateY = 0;
  const movementAmount = 10;

  switch (direction) {
    case "up":
      translateY = interpolate(progress, [0, 1], [movementAmount, -movementAmount]);
      break;
    case "down":
      translateY = interpolate(progress, [0, 1], [-movementAmount, movementAmount]);
      break;
    case "left":
      translateX = interpolate(progress, [0, 1], [movementAmount, -movementAmount]);
      break;
    case "right":
      translateX = interpolate(progress, [0, 1], [-movementAmount, movementAmount]);
      break;
    case "none":
    default:
      translateX = 0;
      translateY = 0;
      break;
  }

  return (
    <div
      style={{
        transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}>
      {children}
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
