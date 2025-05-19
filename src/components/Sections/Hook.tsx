// ------------------------------------------------------------------------------------------------

import React from "react";

import {ScriptSequence} from "../../lib/types";
import {VideoSection} from "../Content/VideoSection";

// ------------------------------------------------------------------------------------------------

interface HookProps {
  script: ScriptSequence;
  startFrame: number;
}

// ------------------------------------------------------------------------------------------------

export const Hook: React.FC<HookProps> = ({script, startFrame}) => {
  return <VideoSection script={script} startFrame={startFrame} />;
};

// ------------------------------------------------------------------------------------------------
