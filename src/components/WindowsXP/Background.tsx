// ------------------------------------------------------------------------------------------------

import React from "react";
import {AbsoluteFill} from "remotion";

// ------------------------------------------------------------------------------------------------

export const Background: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <AbsoluteFill>
      <div className="w-full h-4/6 bg-gradient-to-b from-sky-600 to-sky-400" />
      <svg
        className="absolute bottom-12"
        width="1080"
        height="992"
        viewBox="0 0 1080 992"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1080 107.098C1080 107.098 808.126 164.104 524.757 57.937C241.388 -48.2303 0 23.9926 0 23.9926V992H1080V107.098Z"
          fill="url(#green)"
        />
        <defs>
          <linearGradient id="green" x1="540" y1="6.10365" x2="540" y2="992" gradientUnits="userSpaceOnUse">
            <stop stop-color="#16A34A" />
            <stop offset="1" stop-color="#4ADE80" />
          </linearGradient>
        </defs>
      </svg>
      <AbsoluteFill className="flex flex-col items-center py-32 px-8 space-y-8">{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------
