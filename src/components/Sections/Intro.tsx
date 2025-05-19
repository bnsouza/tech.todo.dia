// ------------------------------------------------------------------------------------------------

import React from "react";

import {ScriptSequence} from "../../lib/types";
import {VideoSection} from "../Content/VideoSection";

// ------------------------------------------------------------------------------------------------

interface IntroProps {
  script: ScriptSequence;
  startFrame: number;
}

// ------------------------------------------------------------------------------------------------

export const Intro: React.FC<IntroProps> = ({script, startFrame}) => {
  return <VideoSection script={script} startFrame={startFrame} />;
};

// ------------------------------------------------------------------------------------------------
