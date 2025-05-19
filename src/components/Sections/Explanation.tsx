// ------------------------------------------------------------------------------------------------

import React from "react";

import {ScriptSequence} from "../../lib/types";
import {VideoSection} from "../Content/VideoSection";

// ------------------------------------------------------------------------------------------------

interface ExplanationProps {
  script: ScriptSequence;
  startFrame: number;
}

// ------------------------------------------------------------------------------------------------

export const Explanation: React.FC<ExplanationProps> = ({script, startFrame}) => {
  return <VideoSection script={script} startFrame={startFrame} />;
};

// ------------------------------------------------------------------------------------------------
