// ------------------------------------------------------------------------------------------------

import path from "path";
import {openai} from "@ai-sdk/openai";
import {generateText} from "ai";

import {Post} from "../types";
import {AudioController} from "./Audio";
import {NextController} from "./Next";
import {PostController} from "./Post";
import {ScriptController} from "./Script";
import {TopicController} from "./Topic";

// ------------------------------------------------------------------------------------------------

export type VideoOptions = {
  language?: "pt" | "en";
  debug?: boolean;
  model?: string;
  playbackRate?: number;
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
  constructor({
    language = "en",
    debug = false,
    model = "gpt-4-turbo",
    playbackRate = 1,
    musicCredits = "",
  }: VideoOptions) {
    // Set the language
    this.language = language;

    // Set the debug mode
    this.debug = debug;

    // Set the model to use for the AI
    this.model = model;

    // Set the playback rate for the audio
    this.playbackRate = playbackRate;

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

    // Generate the text using the AI
    const {text} = await generateText({
      model: openai(this.model),
      system: systemPrompt,
      prompt: nextTopicPrompt,
    });

    // Print the generated text
    this.post = JSON.parse(text);
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
    if (!this.post) throw new Error("The post is empty.");

    // Create a new instance of the ScriptController
    const scriptCtrl = new ScriptController(this.post.topic);

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

    // Generate the text using the AI
    const {text} = await generateText({
      model: openai(this.model),
      system: systemPrompt,
      prompt: nextTopicPrompt,
    });

    // Print the generated text
    const script = JSON.parse(text);
    this.consoleLog(script);
    this.printLine();

    // Generate the audio for the script
    this.consoleLog("Generating audio for the script:");
    const audioCtrl = new AudioController(this.index, this.playbackRate);
    this.post.script = await audioCtrl.generateAudio(script);
    this.postCtrl.updatePost(this.index, this.post);
    this.printLine();
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
