// ------------------------------------------------------------------------------------------------

import path from "path";
import {openai} from "@ai-sdk/openai";
import {generateObject} from "ai";
import {z} from "zod";

import {Post, Script} from "../types";
import {AudioController} from "./Audio";
import {MediaController} from "./Media";
import {NextController} from "./Next";
import {PostController} from "./Post";
import {ScriptController} from "./Script";
import {TopicController} from "./Topic";

// ------------------------------------------------------------------------------------------------

export type VideoOptions = {
  debug?: boolean;
  musicCredits?: string;
};

// ------------------------------------------------------------------------------------------------
// Controller to handle the video creation process and methods to interact with the data
export class VideoController {
  private language: "pt" | "en";
  private debug: boolean;
  private model: string;
  private playbackRate: number;
  private musicCredits: string;

  private postCtrl: PostController;
  private topicCtrl: TopicController;

  private index: number;
  private post: Post | undefined;

  // ----------------------------------------------------------------------------------------------
  // Constructor
  constructor({debug = false, musicCredits = ""}: VideoOptions) {
    // Set the language
    this.language = (process.env.AUTOMATION_LANGUAGE as "pt" | "en") ?? "en";

    // Set the debug mode
    this.debug = debug;

    // Set the model to use for the AI
    this.model = process.env.AUTOMATION_OPENAI_MODEL ?? "gpt-4-turbo";

    // Set the playback rate for the audio
    this.playbackRate = parseFloat(process.env.AUTOMATION_PLAYBACK_SPEED ?? "1.0");

    // Set the music credit
    this.musicCredits = musicCredits;

    // Set the paths for the data files
    const postPath = path.resolve(__dirname, "../data/posts.json");
    const topicPath = path.resolve(__dirname, "../data/topics.json");

    // Create new instances of the PostController and TopicController
    this.postCtrl = new PostController(postPath);
    this.topicCtrl = new TopicController(topicPath, this.postCtrl.getLevel());

    // Get the index of the last post
    this.index = 0;
  }

  // ----------------------------------------------------------------------------------------------
  // Print the content to the console if in debug mode
  private consoleLog(content: unknown) {
    if (this.debug) {
      if (typeof content === "string") console.log(content);
      else console.log(JSON.stringify(content, null, 2));
    }
  }

  // ----------------------------------------------------------------------------------------------
  // Get next topic from the list of topics with the help of AI
  public async generateVideo(): Promise<void> {
    // Print the starting message
    this.printLine();
    this.consoleLog("Starting the script...");
    this.printLine();

    // Get the next topic
    await this.getNextTopic();

    // Prepare the script for the video
    await this.prepareScript();

    // Get the media for the script
    await this.getMedias();
  }

  // ----------------------------------------------------------------------------------------------
  // Get next topic from the list of topics with the help of AI
  public async getNextTopic(): Promise<void> {
    // Create a new instance of the NextController
    const controller = new NextController(this.postCtrl, this.topicCtrl);

    // Get the next topic prompts
    let {systemPrompt, nextTopicPrompt} = controller.getPrompts();

    // Verify the language
    if (this.language === "pt") {
      systemPrompt += " and the contents should be in Brazilian Portuguese.";
    }

    // Print the prompts
    this.consoleLog("Prompts for the next topic:");
    this.consoleLog({systemPrompt, nextTopicPrompt});
    this.printLine();

    // Generate the result object using the AI
    const result = await generateObject({
      model: openai(this.model),
      system: systemPrompt,
      prompt: nextTopicPrompt,
      schema: z.object({
        post: z.object({
          title: z.string(),
          topic: z.string(),
          description: z.string(),
          justification: z.string(),
        }),
      }),
    });

    // Print the generated text
    this.post = result.object.post;
    this.consoleLog(this.post);
    this.printLine();

    // Test if the post is empty
    if (!this.post) {
      throw new Error("The post is empty.");
    }

    // Add the post to the list of topics
    this.index = controller.addPost(
      this.post.title ?? "",
      this.post.topic ?? "",
      this.post.description ?? "",
      this.post.justification ?? ""
    );

    // Print the index of the added topic
    this.consoleLog(`Added topic at index: ${this.index}`);
    this.printLine();
  }

  // ----------------------------------------------------------------------------------------------
  // Prepare the script for the video
  public async prepareScript() {
    // Check if the post is empty
    if (!this.post) throw new Error("Error preparing the script (prepareScript).");

    // Create a new instance of the ScriptController
    const scriptCtrl = new ScriptController(this.post.topic!);

    // Get the next topic prompts
    let {systemPrompt, nextTopicPrompt} = scriptCtrl.getPrompts();

    // Verify the language
    if (this.language === "pt") {
      systemPrompt += " and the contents should be in Brazilian Portuguese.";
    }

    // Print the prompts
    this.consoleLog("Prompts to prepare the script:");
    this.consoleLog({systemPrompt, nextTopicPrompt});
    this.printLine();

    // Generate the result object using the AI
    const result = await generateObject({
      model: openai(this.model),
      system: systemPrompt,
      prompt: nextTopicPrompt,
      schema: z.object({
        script: z.object({
          hook: z.string(),
          intro: z.string(),
          explanation: z.string(),
          example: z.string(),
          engagement: z.string(),
        }),
      }),
    });

    // Print the generated text
    const {script} = result.object;
    this.consoleLog(script);
    this.printLine();

    // Generate the audio for the script
    this.consoleLog("Generating audio for the script:");
    const audioCtrl = new AudioController(this.index, this.playbackRate);
    this.post.script = await audioCtrl.generateAudio(script);

    // Update the post with the new script
    this.postCtrl.updatePost(this.index, this.post);

    // Print the audio script
    if (this.debug && this.post.script) {
      const keys = Object.keys(this.post.script) as Array<keyof Script>;
      for (const key of keys) {
        const audioStr = this.post.script[key]!.audio;
        const durationStr = this.post.script[key]!.duration;
        this.consoleLog(`    - Saving audio in "${audioStr}" (${durationStr} frames)`);
      }
      this.printLine();
      this.consoleLog("Music credits: " + this.musicCredits);
    }
  }

  // ----------------------------------------------------------------------------------------------
  // Print a line to the console
  public async getMedias(): Promise<void> {
    // Check if the post is empty
    if (!this.post || !this.post.topic || !this.post.script) throw new Error("Error preparing the script (getMedias).");

    // Create a new instance of the MediaController
    const {topic, description} = this.post;
    const controller = new MediaController(this.index, topic, description!);

    // Prepare the prompts for selecting b-roll footage
    this.consoleLog("Obtaining b-roll keywords to search for media:");
    this.printLine();

    const keys = Object.keys(this.post.script) as Array<keyof Script>;
    for (const key of keys) {
      const {text, duration} = this.post.script[key]!;
      const {systemPrompt, nextTopicPrompt} = controller.getPrompts(key, text, duration);

      // Print the prompts
      this.consoleLog(`Prompts to ${key} section:`);
      this.consoleLog({systemPrompt, nextTopicPrompt});
      this.printLine();

      // Generate the result object using the AI
      const result = await generateObject({
        model: openai(this.model),
        system: systemPrompt,
        prompt: nextTopicPrompt,
        schema: z.object({
          keywords: z.array(z.string()),
        }),
      });

      // Print the generated text
      const {keywords} = result.object;
      this.consoleLog(keywords);
      this.printLine();

      // Get the media(s) for the script
      this.post.script[key]!.media = await controller.getMedia(key, keywords);
    }

    // Update the post with the new media
    this.postCtrl.updatePost(this.index, this.post);
  }

  // ----------------------------------------------------------------------------------------------
  // Print a line to the console
  public printLine() {
    const width = process.stdout.columns || 80;
    const line = "=".repeat(width);
    this.consoleLog(line);
  }

  // ----------------------------------------------------------------------------------------------
} // End of VideoController
// ------------------------------------------------------------------------------------------------
