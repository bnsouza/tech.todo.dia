// ------------------------------------------------------------------------------------------------

import React from "react";
import {Composition, staticFile} from "remotion";

import {calculateVideoMetadata, Reel, reelVideoSchema} from "./Reel";

import "./tailwind.css";

// ------------------------------------------------------------------------------------------------

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Reel"
        component={Reel}
        width={1080}
        height={1920}
        calculateMetadata={calculateVideoMetadata}
        schema={reelVideoSchema}
        defaultProps={{
          src: staticFile("post.json"),
        }}
      />
    </>
  );
};

// ------------------------------------------------------------------------------------------------
