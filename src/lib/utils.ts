// ------------------------------------------------------------------------------------------------

import {getStaticFiles} from "remotion";

import {PLAYBACK_RATE} from "../Reel";
import {KenBurnsDirection, Media, ScriptSequence} from "./types";

// ------------------------------------------------------------------------------------------------

export const getFileExists = (file: string) => {
  const files = getStaticFiles();
  const fileExists = files.find((f) => {
    return f.src === file;
  });
  return Boolean(fileExists);
};

// ------------------------------------------------------------------------------------------------

export const isVideo = (file: string) => {
  const videoExtensions = [".mp4", ".mov", ".avi", ".webm"];
  return videoExtensions.some((ext) => file.toLowerCase().endsWith(ext));
};

// ------------------------------------------------------------------------------------------------

export const breathDurationSeconds = 0.5;
export const breathDurationFrames = (fps: number): number => breathDurationSeconds * fps;

// ------------------------------------------------------------------------------------------------

export const getOrientation = (width: number, height: number): "square" | "portrait" | "landscape" => {
  if (width === height) return "square";
  if (Math.abs(width - height) / Math.max(width, height) <= 0.1) return "square";
  return width > height ? "landscape" : "portrait";
};

// ------------------------------------------------------------------------------------------------

export const determineKenBurnsDirection = (media: Media): KenBurnsDirection => {
  if (media.kenBurnsDirection) {
    return media.kenBurnsDirection;
  }

  if (media.width && media.height) {
    const orientation = getOrientation(media.width, media.height);
    switch (orientation) {
      case "square":
        return "none";
      case "portrait":
        return Math.random() < 0.5 ? "up" : "down";
      case "landscape":
        return Math.random() < 0.5 ? "left" : "right";
      default:
        return "none";
    }
  }

  // Se não puder determinar, sorteia uma direção apropriada
  const randomChoice = Math.random();
  if (randomChoice < 0.25) return "up";
  if (randomChoice < 0.5) return "down";
  if (randomChoice < 0.75) return "left";
  return "right";
};

// ------------------------------------------------------------------------------------------------

export const prepareScripts = (scripts: {[key: string]: ScriptSequence}): {[key: string]: ScriptSequence} => {
  const preparedScripts: {[key: string]: ScriptSequence} = {};

  for (const [key, script] of Object.entries(scripts)) {
    for (const segment of script.segments) {
      if (segment.startMs) {
        segment.startMs = Math.round(segment.startMs / PLAYBACK_RATE);
        segment.endMs = Math.round(segment.endMs / PLAYBACK_RATE);
      }
    }

    const updatedMedia = script.media?.map((media) => ({
      ...media,
      kenBurnsDirection: determineKenBurnsDirection(media),
    }));
    preparedScripts[key] = {...script, media: updatedMedia};
  }

  return preparedScripts;
};

// ------------------------------------------------------------------------------------------------
