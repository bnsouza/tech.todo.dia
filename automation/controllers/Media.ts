import {existsSync, mkdirSync, writeFileSync} from "fs";
import * as path from "path";
import {createClient, Video} from "pexels";
import {getJson} from "serpapi";

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
        "You are a professional media finder specializing in technology and computing. " +
        "You excel at identifying and recommending the best b-roll footage for video projects " +
        "related to technology, computers, the internet, and programming.\n\n" +
        "**Your Objectives:**\n\n" +
        "1. **Media Type Suggestions**:\n" +
        "Based on the inputs provided, generate suitable media options for each of the following types:\n" +
        "- `stock`: Stock Video or Photo. Provide appropriate stock media keywords suggestions.\n" +
        "- `google`: Google Image Search. Suggest relevant images to search for, " +
        "especially if depicting a person or when no suitable stock video is available.\n" +
        "- `sdig`: Stable Diffusion Image Generation. Generate suitable prompt for image creation " +
        "using Stable Diffusion, particularly if appropriate stock media keywords cannot be provided.\n\n" +
        "2. **Keyword Generation**:\n" +
        "- To `stock` or `google`:\n" +
        "  - Generate **highly relevant and practical keywords suggestions** " +
        "tailored to enhance the visual storytelling of the provided inputs.\n" +
        "  - Ensure the keywords are likely to yield useful results in stock media repositories " +
        "by avoiding overly abstract or uncommon terms.\n" +
        "- To `sdig`: provide a **detailed prompt** for Stable Diffusion Image Generation as " +
        "a fallback option. Crafting a clear and descriptive prompt that captures the desired " +
        "visual elements and emotional tone.\n\n" +
        "**Guidelines:**\n\n" +
        "- **Clarity and Practicality**: Focus on generating keywords or prompts that are practical, " +
        "relevant, and likely to yield useful results.\n" +
        "- **Language Consistency**: Provide keywords and prompts in English to match the language " +
        "used in most stock media repositories and Stable Diffusion models.\n" +
        "- **Avoid Overly Abstract Terms**: Use common visual themes and avoid overly niche " +
        "or abstract terms to increase the likelihood of finding suitable media.\n" +
        "- **Emphasize Availability**: Prioritize media types that are readily available, " +
        "using Stable Diffusion as a fallback option.\n\n" +
        "**Please provide " +
        (suggestionsQty > 1 ? `${suggestionsQty} different suggestions. ` : "one suggestion. ") +
        "Just your final decision, without including these instructions or considerations in your response.**",
      nextTopicPrompt:
        "**Instructions:**\n\n" +
        "### 1. Input Analysis:\n" +
        `- Topic: \`${this.topic}\` (The overarching theme or subject of the video).\n` +
        `- Description: \`${this.description}\` (Detailed overview of the video’s purpose, structure, and main points).\n` +
        `- Section: \`${section}\` (${this.sectionsDetails[section]}).\n` +
        `- Narration: \`${text}\` (The exact script or voiceover text to be spoken during the b-roll footage).\n` +
        `- Duration: \`${duration}\` (The number of frames in a 30fps video).\n\n` +
        "### 2. Keyword Generation Process:\n" +
        "- Step 1: Language Consistency. Since most stock media repositories use English keywords, " +
        "ensure the answer needs to be in English, even if the inputs are in another language.\n" +
        "- Step 2: Analyze the provided inputs to determine the core visual and " +
        "thematic elements of the video, focusing on technology-related imagery.\n" +
        "- Step 3: Identify key subjects, actions, and emotional tones " +
        "conveyed by the narration within the context of technology.\n" +
        "- Step 4: Propose only highly relevants keywords or a short keyword phrase for " +
        "searching stock media, focusing on common visual representations in technology.\n" +
        "- Step 5: Ensure these keywords are likely to yield useful results in " +
        "stock media repositories by avoiding overly abstract or uncommon terms.\n" +
        "- Step 6: Consider the duration of the b-roll footage needed " +
        "to align with the narration and visual storytelling.\n\n" +
        "### 3. Stable Diffusion Prompt:\n" +
        "- Craft a detailed and vivid prompt for Stable Diffusion Image Generation " +
        "that aligns with the video's content and the provided narration.\n" +
        "- This prompt will be used with 'DPM++ 2M SDE Karras' to generate " +
        "a high-quality image that visually represents the video's content.\n" +
        "- Ensure the prompt is clear, descriptive, and suitable.",
    };

    return finalPrompt;
  }

  // ----------------------------------------------------------------------------------------------
  // Get the topic for the media search
  public async getMedia(
    section: string,
    suggestions: {stock: string; google: string; sdig: string}[]
  ): Promise<Media[]> {
    // Prepare the media list
    const mediaList: Media[] = [];

    // Loop through the suggestions
    for (const {stock, google, sdig} of suggestions) {
      // Search for stock media based on the suggestion
      const mediaStock = await this.searchStock(section, stock);
      if (mediaStock) {
        mediaList.push(mediaStock);
        continue;
      }

      // If no media is found, search for an image on Google Images based on the suggestion
      const mediaGoogle = await this.searchGoogleImages(section, google);
      if (mediaGoogle) {
        mediaList.push(mediaGoogle);
        continue;
      }

      // If no media is found, generate an image using Stable Diffusion
      const mediaSD = await this.generateImage(section, sdig);
      if (mediaSD) mediaList.push(mediaSD);
    }

    // Return the list of media
    return mediaList;
  }

  // ----------------------------------------------------------------------------------------------
  // Get the duration in frames for the given audio file
  private async generateImage(section: string, prompt: string): Promise<Media | undefined> {
    const payload = {
      prompt,
      scheduler: "DPM++ 2M SDE Karras",
      num_inference_steps: 35,
      width: 1024,
      height: 1280,
    };

    // Call the AI to generate the image
    const resp = await fetch(
      `https://${process.env.BASETEN_SD_MODEL}.api.baseten.co/${process.env.BASETEN_ENV}/predict`,
      {
        method: "POST",
        headers: {Authorization: `Api-Key ${process.env.BASETEN_API_KEY}`},
        body: JSON.stringify(payload),
      }
    );

    const sdData = await resp.json();
    if (sdData.status === "success") {
      const media = await this.downloadMedia({
        type: "base64",
        section,
        original: sdData.data,
        width: payload.width,
        height: payload.height,
      });
      if (media)
        return {
          ...media,
          original: `Stable Diffusion Prompt: ${prompt}`,
        };
    }
  }

  // ----------------------------------------------------------------------------------------------
  private async searchGoogleImages(section: string, keyword: string): Promise<Media | undefined> {
    const json = await getJson({
      api_key: process.env.SERPAPI_API_KEY,
      engine: "google_images",
      google_domain: "google.com",
      q: keyword,
      hl: "en",
      gl: "us",
    });

    if (json.images_results && json.images_results.length > 0) {
      for (const image of json.images_results) {
        if (image.original_width < 960 || image.original_height < 960) continue;
        if (this.mediaIDs.includes(image.original)) continue;

        this.mediaIDs.push(image.original);
        const media = await this.downloadMedia({
          type: "url",
          section,
          original: image.original,
          width: image.original_width,
          height: image.original_height,
        });
        if (media) return media;
      }
    }
  }

  // ----------------------------------------------------------------------------------------------
  private async searchStock(section: string, keyword: string): Promise<Media | undefined> {
    // Try to find a video based on the keyword
    const videoResult = await this.pexels.videos.search({query: keyword, per_page: this.mediaIDs.length + 2});

    // If a video is found, return the video link
    if ("videos" in videoResult && videoResult.videos.length > 0) {
      let original = "";
      let width: number | undefined;
      let height: number | undefined;
      let duration: number | undefined;

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
          original = videoData.link;
          width = videoData.width;
          height = videoData.height;
          duration = videoData.duration;
          break;
        }
      }

      // Check if a video link is found, set the media object and return it
      if (original) {
        const media = await this.downloadMedia({type: "url", section, original, width, height, duration});
        if (media) return media;
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
        const {width, height} = image;
        const media = await this.downloadMedia({type: "url", section, original: image.src.original, width, height});
        if (media) return media;
      }
    }
  }

  // ----------------------------------------------------------------------------------------------
  // Get the highest resolution video file
  private getHighestResolutionVideo(
    video: Video
  ): {link: string; width: number; height: number; duration: number} | null {
    let link = "";
    let width = 0;
    let height = 0;
    let duration = 0;
    const sizes = [1280, 1000, 720];

    for (const size of sizes) {
      for (const file of video.video_files) {
        if ((file.width ?? 0) >= size && (file.height ?? 0) >= size) {
          this.mediaIDs.push(video.id);
          link = file.link;
          width = file.width ?? 0;
          height = file.height ?? 0;
          duration = Math.floor((file.fps ?? 30) * video.duration);
          return {link, width, height, duration};
        }
      }
    }
    return null;
  }

  // ----------------------------------------------------------------------------------------------
  // Download the media
  private async downloadMedia({
    type,
    section,
    original,
    width,
    height,
    duration,
  }: {
    type: "url" | "base64";
    section: string;
    original: string;
    width?: number;
    height?: number;
    duration?: number;
  }): Promise<Media | undefined> {
    // Check if there is content to download
    if (!original) return undefined;

    // Verify if the media directory exists and create it if it doesn't
    const mediaDir = path.join(__dirname, `../../public/media/${this.index}/${section}`);
    if (!existsSync(mediaDir)) {
      mkdirSync(mediaDir, {recursive: true});
    }

    // Set the file name
    const file = type === "base64" ? `${Date.now()}.png` : (original.split("/").pop() ?? "");
    if (file === "") return undefined;

    let buffer: Buffer;
    if (type === "url") {
      // Fetch the file and convert it to a buffer
      const response = await fetch(original);
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = Buffer.from(original, "base64");
    }

    // Download the media file
    const mediaPath = path.join(mediaDir, file);
    writeFileSync(mediaPath, buffer);

    return {
      original: type === "base64" ? "Stable Diffusion Prompt" : original,
      file: path.relative(path.join(mediaDir, "../../.."), mediaPath),
      width,
      height,
      duration,
    };
  }

  // ----------------------------------------------------------------------------------------------
} // End of MediaController
// ------------------------------------------------------------------------------------------------
