import {existsSync, mkdirSync, writeFileSync} from "fs";
import * as path from "path";
import {createClient, Video} from "pexels";

import {Media} from "../types";

// ------------------------------------------------------------------------------------------------
// Controller to handle the media selection process
export class MediaController {
  private index: string;
  private topic: string;
  private description: string;
  private pexels;
  private sectionsDetails: {[key: string]: string};
  private mediaIDs: number[] = [];

  private usersToSkip: string[] = ["754623426"];

  // ----------------------------------------------------------------------------------------------
  // Constructor
  constructor(index: number, topic: string, description: string) {
    this.index = index.toString().padStart(3, "0");
    this.topic = topic;
    this.description = description;
    this.pexels = createClient(process.env.PEXELS_API_KEY ?? "");

    this.sectionsDetails = {
      hook: "The opening segment designed to immediately grab the viewer’s attention and spark interest in the topic.",
      intro:
        "The introductory part that provides an overview of the video’s content and outlines what the viewer can expect.",
      explanation:
        "The section where detailed information, concepts, and mechanics of the topic are thoroughly explained.",
      example:
        "A segment that illustrates the concepts discussed by providing concrete examples or real-world applications.",
      engagement:
        "The part of the video designed to interact with the viewer, encouraging them to think, respond, or take action.",
    };
  }

  // ----------------------------------------------------------------------------------------------
  // Prepare the prompts for selecting b-roll footage
  public getPrompts(section: string, text: string, duration: number): {systemPrompt: string; nextTopicPrompt: string} {
    // Calculate the number of suggestions based on the duration
    const suggestionsQty = Math.ceil(duration / parseInt(process.env.AUTOMATION_B_ROLL_MAX_DURATION ?? "150", 10));

    // Prepare the final prompts
    const finalPrompt = {
      systemPrompt:
        "Act like a professional media finder specializing in technology and computing. " +
        "You specialize in identifying and recommending the best b-roll footage for video projects " +
        "related to technology, computers, the internet, and programming. Your objective is to " +
        `generate ${suggestionsQty} practical keyword suggestions tailored to enhance ` +
        "the visual storytelling of the provided inputs, ensuring they are likely to yield useful " +
        "results in stock media repositories. You have extensive experience in analyzing video content " +
        "and understanding its visual and thematic requirements within the technology domain.",
      nextTopicPrompt:
        "**Instructions:**\n" +
        "### 1. Input Analysis:\n" +
        `  • Topic: \`${this.topic}\` (The overarching theme or subject of the video).\n` +
        `  • Description: \`${this.description}\` (Detailed overview of the video’s purpose, structure, and main points).\n` +
        `  • Part: \`${section}\` (${this.sectionsDetails[section]}).\n` +
        `  • Narration: \`${text}\` (The exact script or voiceover text to be spoken during the b-roll footage).\n` +
        `  • Duration: \`${duration}\` (The number of frames in a 30fps video).\n` +
        "### 2. Keyword Generation Process:\n" +
        "  • Step 1: Language Consistency. Since most stock media repositories use English keywords, " +
        "ensure the answer needs to be in English, even if the inputs are in another language.\n" +
        "  • Step 2: Analyze the provided inputs to determine the core visual and thematic elements " +
        "of the video, focusing on technology-related imagery.\n" +
        "  • Step 3: Identify key subjects, actions, and emotional tones conveyed by " +
        "the narration within the context of technology.\n" +
        "  • Step 4: Propose only highly relevants keywords or a short keyword phrase " +
        "for searching stock media, focusing on common visual representations in technology.\n" +
        "  • Step 5: Ensure these keywords are likely to yield useful results in stock media " +
        "repositories by avoiding overly abstract or uncommon terms.\n" +
        "  • Step 6: Consider the duration of the b-roll footage needed to align with the " +
        "narration and visual storytelling.",
    };

    return finalPrompt;
  }

  // ----------------------------------------------------------------------------------------------
  // Get the topic for the media search
  public async getMedia(section: string, keywords: string[]): Promise<Media[]> {
    // Prepare the media list
    const mediaList: Media[] = [];

    // Loop through the keywords
    for (const keyword of keywords) {
      // Search for media based on the keywords
      const media = await this.searchMedia(keyword);

      // If media is found, download it and add it to the list
      if (media) {
        media.file = await this.downloadMedia(section, media);
        mediaList.push(media);
      }
    }

    // Return the list of media
    return mediaList;
  }

  // ----------------------------------------------------------------------------------------------
  public async searchMedia(keyword: string): Promise<Media | null> {
    // Try to find a video based on the keyword
    const videoResult = await this.pexels.videos.search({query: keyword, per_page: this.mediaIDs.length + 2});

    // If a video is found, return the video link
    if ("videos" in videoResult && videoResult.videos.length > 0) {
      let link = "";
      let duration = 0;

      // Loop through the video results
      for (const video of videoResult.videos) {
        // Skip if the video ID is already used
        if (this.mediaIDs.includes(video.id)) continue;

        // Skip if the user is in the skip list
        if (this.usersToSkip.includes(video.user.id.toString())) continue;

        // Check the video files for the best resolution
        const videoData = this.getHighestResolutionVideo(video);

        // If a video link is found, break the loop
        if (videoData) {
          link = videoData.link;
          duration = videoData.duration;
          break;
        }
      }

      // Check if a video link is found, set the media object and return it
      if (link) {
        const media = {type: "video", video: link, duration} as Media;
        return media;
      }
    }

    // If no video is found, search for an image
    const imageResult = await this.pexels.photos.search({query: keyword, per_page: this.mediaIDs.length + 2});

    // If an image is found, return the image link
    if ("photos" in imageResult && imageResult.photos.length > 0) {
      // Loop through the image results
      for (const image of imageResult.photos) {
        // Skip if the image ID is already used
        if (this.mediaIDs.includes(image.id)) continue;

        // Skip if the user is in the skip list
        if (this.usersToSkip.includes(image.photographer_id.toString())) continue;

        // Set the media object and return it
        this.mediaIDs.push(image.id);
        const media = {type: "image", image: image.src.original} as Media;
        return media;
      }
    }

    // If no media is found, return null
    return null;
  }

  // ----------------------------------------------------------------------------------------------
  // Get the highest resolution video file
  private getHighestResolutionVideo(video: Video): {link: string; duration: number} | null {
    let link = "";
    let duration = 0;
    const sizes = [1280, 1000, 720];

    for (const size of sizes) {
      for (const file of video.video_files) {
        if ((file.width ?? 0) >= size && (file.height ?? 0) >= size) {
          this.mediaIDs.push(video.id);
          link = file.link;
          duration = Math.floor((file.fps ?? 30) * video.duration);
          return {link, duration};
        }
      }
    }
    return null;
  }

  // ----------------------------------------------------------------------------------------------
  // Download the media
  public async downloadMedia(section: string, media: Media): Promise<string> {
    let file;

    // Download the media based on the type
    if (media.video) {
      file = media.video;
    } else if (media.image) {
      file = media.image;
    }

    // Check if a file is found
    if (!file) return "";

    // Verify if the media directory exists and create it if it doesn't
    const mediaDir = path.join(__dirname, `../../public/media/${this.index}/${section}`);
    if (!existsSync(mediaDir)) {
      mkdirSync(mediaDir, {recursive: true});
    }

    // Download the media file
    const mediaPath = path.join(mediaDir, file.split("/").pop() ?? "");
    await this.saveFile(file, mediaPath);

    return path.relative(path.join(mediaDir, "../../../.."), mediaPath);
  }

  // ----------------------------------------------------------------------------------------------
  // Save the file to disk
  private async saveFile(url: string, filePath: string): Promise<void> {
    // Fetch the file
    const response = await fetch(url);

    // Convert the response to a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write the buffer to the file
    writeFileSync(filePath, buffer);
  }

  // ----------------------------------------------------------------------------------------------
} // End of MediaController
// ------------------------------------------------------------------------------------------------
