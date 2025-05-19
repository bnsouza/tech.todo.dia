// ------------------------------------------------------------------------------------------------

import React from "react";

import {ScriptSequence} from "../../lib/types";
import {VideoSection} from "../Content/VideoSection";

// ------------------------------------------------------------------------------------------------

interface ExampleProps {
  script: ScriptSequence;
  startFrame: number;
}

// ------------------------------------------------------------------------------------------------

export const Example: React.FC<ExampleProps> = ({script, startFrame}) => {
  return <VideoSection script={script} startFrame={startFrame} />;
};

// ------------------------------------------------------------------------------------------------
