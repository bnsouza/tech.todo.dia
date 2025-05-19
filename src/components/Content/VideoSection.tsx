// ------------------------------------------------------------------------------------------------

import React, {useMemo} from "react";
import {Caption, createTikTokStyleCaptions} from "@remotion/captions";
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from "remotion";

import {ScriptSequence} from "../../lib/types";
import {breathDurationFrames, isVideo} from "../../lib/utils";
import {PLAYBACK_RATE, SWITCH_CAPTIONS_EVERY_MS} from "../../Reel";
import {KenBurnsEffect} from "./KenBurnsEffect";
import {MediaComponent} from "./MediaComponent";
import SubtitlePage from "./SubtitlePage";

// ------------------------------------------------------------------------------------------------

interface VideoSectionProps {
  script: ScriptSequence;
  startFrame: number; // Frame inicial desta seção
}

// ------------------------------------------------------------------------------------------------

export const VideoSection: React.FC<VideoSectionProps> = ({script, startFrame}) => {
  const {fps} = useVideoConfig();

  // Breathing room
  const totalDurationFrames = script.duration + 2 * breathDurationFrames(fps);

  const mediaCount = script.media?.length ?? 1;
  const durationPerMedia = Math.floor(totalDurationFrames / mediaCount);
  const remainingFrames = totalDurationFrames - durationPerMedia * mediaCount;

  const mediaDurations = script.media?.map((media, index) => {
    const extraFrame = index < remainingFrames ? 1 : 0;
    return durationPerMedia + extraFrame;
  });

  const {pages} = useMemo(() => {
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: (script.segments as Caption[]) ?? [],
    });
  }, [script.segments]);

  return (
    <Sequence from={startFrame} durationInFrames={totalDurationFrames}>
      <Sequence from={breathDurationFrames(fps)}>
        <Audio src={staticFile(script.audio)} playbackRate={PLAYBACK_RATE} />
      </Sequence>
      <AbsoluteFill>
        {script.media?.map((media, index) => {
          const assignedDuration = mediaDurations![index];
          const mediaStartFrame = mediaDurations!.slice(0, index).reduce((acc, dur) => acc + dur, 0);

          return (
            <Sequence key={index} from={mediaStartFrame} durationInFrames={assignedDuration}>
              {isVideo(media.file) ? (
                <MediaComponent media={media} />
              ) : (
                <KenBurnsEffect durationInFrames={assignedDuration} direction={media.kenBurnsDirection}>
                  <MediaComponent media={media} />
                </KenBurnsEffect>
              )}
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Sequence from={breathDurationFrames(fps)}>
        <AbsoluteFill>
          {pages.map((page, index) => {
            const nextPage = pages[index + 1] ?? null;
            const subtitleStartFrame = (page.startMs / 1000) * fps;
            const subtitleEndFrame = Math.min(
              nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
              subtitleStartFrame + SWITCH_CAPTIONS_EVERY_MS
            );
            const durationInFrames = subtitleEndFrame - subtitleStartFrame;
            if (durationInFrames <= 0) {
              return null;
            }

            return (
              <Sequence key={index} from={subtitleStartFrame} durationInFrames={durationInFrames}>
                <SubtitlePage key={index} page={page} />
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Sequence>
    </Sequence>
  );
};

// ------------------------------------------------------------------------------------------------
