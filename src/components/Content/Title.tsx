import React from "react";
import {interpolate, useCurrentFrame} from "remotion";

export const Title: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1]);

  return (
    <h1
      style={{
        fontFamily: "Tahoma, sans-serif",
        fontSize: 40,
        textAlign: "center",
        opacity,
        margin: "0 0 20px 0",
      }}>
      {text}
    </h1>
  );
};
