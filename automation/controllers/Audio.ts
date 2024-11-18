/* eslint-disable camelcase */
// ------------------------------------------------------------------------------------------------

import {createWriteStream} from "fs";
import {createReadStream} from "node:fs";
import * as path from "path";
import {pipeline, Readable} from "stream";
import {promisify} from "util";
import {ElevenLabsClient} from "elevenlabs";
import {loadMusicMetadata} from "music-metadata";

import {AudioProps, ScriptTexts} from "../types";

// ------------------------------------------------------------------------------------------------
// Controller to handle the audio script creation process
export class AudioController {
  private client;
  private index: string;
  private playbackRate: number;

  // ----------------------------------------------------------------------------------------------
  // Constructor
  constructor(index: number, playbackRate = 1) {
    this.client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY ?? "",
    });

    this.index = index.toString().padStart(3, "0");
    this.playbackRate = playbackRate;
  }

  // ----------------------------------------------------------------------------------------------
  // Generate audio files for the given script
  public async generateAudio(script: ScriptTexts): Promise<{[key: string]: AudioProps}> {
    const keys = Object.keys(script);
    const audioScript: {[key: string]: AudioProps} = {};

    for (const key of keys) {
      const audio = await this.client.generate({
        voice: process.env.ELEVENLABS_VOICE_ID ?? "Bella",
        text: script[key],
        model_id: "eleven_multilingual_v2",
      });

      // Save file to disk
      const filePath = path.join(__dirname, `../../public/audio/${this.index}/${key}.mp3`);
      console.log(`    - Saving audio in "${filePath}"`);
      await this.saveFile(audio, filePath);

      audioScript[key] = {
        text: script[key],
        audio: filePath,
        duration: await this.getDurationInFrames(filePath),
      };
    }

    return audioScript;
  }

  // ----------------------------------------------------------------------------------------------
  // Get the duration in frames for the given audio file
  private async getDurationInFrames(filePath: string, fps: number = 30): Promise<number> {
    const durationInSeconds = await this.getDurationInSeconds(filePath);
    return Math.ceil((durationInSeconds * fps) / this.playbackRate);
  }

  // ----------------------------------------------------------------------------------------------
  // Get the duration in seconds for the given audio file
  private async getDurationInSeconds(filePath: string): Promise<number> {
    try {
      // Dynamic load the music-metadata ESM module
      const {parseStream} = await loadMusicMetadata();

      // Create a readable stream from a file
      const audioStream = createReadStream(filePath);

      // Parse the metadata from the stream
      const metadata = await parseStream(audioStream, {mimeType: "audio/mpeg"});

      // Return the duration in seconds
      return metadata.format.duration ?? 0;
    } catch (e) {
      console.error("Error parsing metadata:", e);
      return 0;
    }
  }

  // ----------------------------------------------------------------------------------------------
  // Save the audio file to disk
  private async saveFile(src: any, filePath: string): Promise<void> {
    const pipelineAsync = promisify(pipeline);
    const writableStream = createWriteStream(filePath);

    // Convert src to a readable stream if it's not already one
    if (!(src instanceof Readable)) {
      src = Readable.from(src);
    }

    try {
      await pipelineAsync(src, writableStream);
    } catch (err) {
      console.error("Failed to save audio file", err);
      throw err;
    }
  }
  // ----------------------------------------------------------------------------------------------
} // End of AudioController
// ------------------------------------------------------------------------------------------------
