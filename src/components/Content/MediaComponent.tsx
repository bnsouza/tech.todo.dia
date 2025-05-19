// ------------------------------------------------------------------------------------------------

import React from "react";
import {Img, staticFile, Video} from "remotion";

import {Media} from "../../lib/types";
import {isVideo} from "../../lib/utils";

// ------------------------------------------------------------------------------------------------

interface MediaComponentProps {
  media: Media;
  style?: React.CSSProperties;
}

// ------------------------------------------------------------------------------------------------

export const MediaComponent: React.FC<MediaComponentProps> = ({media, style}) => {
  if (isVideo(media.file)) {
    return (
      <Video
        src={staticFile(media.file)}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          ...style,
        }}
        volume={0}
        delayRenderTimeoutInMilliseconds={60000}
      />
    );
  }
  return (
    <Img
      src={staticFile(media.file)}
      style={{
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
};

// ------------------------------------------------------------------------------------------------
