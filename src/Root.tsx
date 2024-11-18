import {Composition, staticFile} from "remotion";

import {calculateCaptionedVideoMetadata, CaptionedVideo, captionedVideoSchema} from "./CaptionedVideo";
import {Reel} from "./Reel/Reel";

import "./tailwind.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Reel" component={Reel} durationInFrames={2700} fps={30} width={1080} height={1920} />
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("Reel.mp4"),
        }}
      />
    </>
  );
};
