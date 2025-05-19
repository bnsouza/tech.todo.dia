// ------------------------------------------------------------------------------------------------

import React from "react";

import {ScriptSequence} from "../../lib/types";
import {VideoSection} from "../Content/VideoSection";

// ------------------------------------------------------------------------------------------------

interface EngagementProps {
  script: ScriptSequence;
  startFrame: number;
}

// ------------------------------------------------------------------------------------------------

export const Engagement: React.FC<EngagementProps> = ({script, startFrame}) => {
  return <VideoSection script={script} startFrame={startFrame} />;
};

// ------------------------------------------------------------------------------------------------
