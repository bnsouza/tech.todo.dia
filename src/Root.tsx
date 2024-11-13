import "./tailwind.css";
import {Composition, staticFile} from "remotion";
import {CaptionedVideo, calculateCaptionedVideoMetadata, captionedVideoSchema} from "./CaptionedVideo";

import {TodayVideo} from "./TodayVideo/TodayVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="TodayVideo" component={TodayVideo} durationInFrames={2700} fps={30} width={1080} height={1920} />
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("TodayVideo.mp4"),
        }}
      />
    </>
  );
};
