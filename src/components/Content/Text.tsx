import React from "react";
import {interpolate, useCurrentFrame} from "remotion";

export const Text: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1]);

  return (
    <p
      style={{
        fontFamily: "Tahoma, sans-serif",
        fontSize: 28,
        textAlign: "center",
        opacity,
        maxWidth: "90%",
        margin: "0 auto",
        lineHeight: 1.5,
      }}>
      {text}
    </p>
  );
};
