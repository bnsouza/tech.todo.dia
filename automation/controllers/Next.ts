// ------------------------------------------------------------------------------------------------

import {PostController} from "./Post";
import {TopicController} from "./Topic";

// ------------------------------------------------------------------------------------------------
// Controller to handle the next topic suggestions and methods to interact with the data
export class NextController {
  private postCtrl: PostController;
  private topicCtrl: TopicController;
  private coveredTopics: string;

  // ----------------------------------------------------------------------------------------------
  // Constructor
  constructor(postCtrl: PostController, topicCtrl: TopicController) {
    this.postCtrl = postCtrl;
    this.topicCtrl = topicCtrl;
    this.syncLevels();
    this.coveredTopics = "";
  }

  // ----------------------------------------------------------------------------------------------
  // Get the active level
  public getActiveLevel(): string {
    return this.postCtrl.getLevel();
  }

  // ----------------------------------------------------------------------------------------------
  // Sync the levels between the post handler and the topic
  public syncLevels() {
    if (this.getActiveLevel() !== this.topicCtrl.getLevel()) {
      this.postCtrl.setLevel(this.topicCtrl.getLevel());
    }
  }

  // ----------------------------------------------------------------------------------------------
  // Prepare the next topic prompts
  public getPrompts(): {systemPrompt: string; nextTopicPrompt: string} {
    // Get the covered topics, the first instruction, the progression instruction, and the actual level
    this.getCoveredTopics();
    const firstInstruction = this.getRemainingTopicsInstruction();
    const progressionInstruction = this.topicCtrl.getProgression();
    const actualLevel = this.getActiveLevel();

    // Prepare the final prompts
    const finalPrompt = {
      systemPrompt:
        "Act like a professional content strategist specializing in educational short-form videos " +
        "for Instagram and TikTok. Your expertise is in creating engaging, bite-sized content that " +
        "builds foundational knowledge of technology topics and gradually increases in complexity.",
      nextTopicPrompt:
        "**Objective:**\n" +
        "Suggest the next single topic for a 60-90 second video. " +
        "Focus on building foundational knowledge for beginners. " +
        `We are currently at level \`${actualLevel}\`, and ` +
        (this.coveredTopics
          ? `the series has already covered the following topics in this level: ${this.coveredTopics}.`
          : "this is the first topic of the series in this level.") +
        `\n\n**Conceptual Progression for Level \`${actualLevel}\`:**\n` +
        progressionInstruction +
        "\n\n**Instructions:**\n" +
        `1. ${firstInstruction}\n` +
        "2. Compare the topics and evaluate which one:\n" +
        "   - Best aligns with the current level.\n" +
        "   - Builds logically on foundational concepts.\n" +
        "   - Will likely engage a beginner audience.\n" +
        "3. Ensure the response includes only one topic and follows the JSON format strictly.\n" +
        "4. Justify your choice by explaining why it is a better fit compared to the other options.",
    };

    return finalPrompt;
  }

  // ----------------------------------------------------------------------------------------------
  // Get the topics covered so far
  public getCoveredTopics(): string {
    const topics = this.postCtrl.getAllPosts().map((post) => post.topic);
    if (topics.length > 0) {
      this.coveredTopics = "`" + topics.join("`, `") + "`";
    } else {
      this.coveredTopics = "";
    }
    return this.coveredTopics;
  }

  // ----------------------------------------------------------------------------------------------
  // Get the remaining topics to help the AI suggest the next topic
  public getRemainingTopicsInstruction(): string {
    // Get all remaining topics for the current level
    const remainingTopics = this.topicCtrl.getAllRemainingTopics(this.coveredTopics);

    // If there are remaining topics, suggest one of them
    if (remainingTopics.length) {
      return (
        "Based on the current progression of the series, suggest one and only one topic from the following list: `" +
        remainingTopics.join("`, `") +
        "`"
      );
    }

    // There are no remaining topics in this level, move to the next level
    const nextLevel = this.topicCtrl.setNextLevel();

    // If we covered all available topics, set the AI free to suggest a new topic
    if (!nextLevel) {
      return "The series has covered all available topics. Please suggest a new topic.";
    }

    // There are still new levels, suggest to review the next level
    this.postCtrl.setLevel(nextLevel);
    return (
      "The series has covered all available topics of this level. " +
      "Please review the next level items and feel free to suggest topic not covered yet and not listed " +
      "in the next level items or advance to one of the next level topics:" +
      this.topicCtrl.getAllRemainingTopics().join(", ")
    );
  }

  // ----------------------------------------------------------------------------------------------
  // After the AI suggests a topic, add it to the list of topics
  public addPost(title: string, topic: string, description: string, justification: string): number {
    const post = {title, topic, level: this.getActiveLevel(), description, justification};
    const index = this.postCtrl.addPost(post);
    return index;
  }

  // ----------------------------------------------------------------------------------------------
  // Update a post in the list of topics
  public updatePost(index: number, key: string, value: string): void {
    const topic = this.postCtrl.getPost(index);
    if (!topic) {
      throw new Error("Topic not found");
    }
    // @ts-expect-error - We know that the key exists in the topic object
    topic[key] = value;
    this.postCtrl.updatePost(index, topic);
  }

  // ----------------------------------------------------------------------------------------------
} // End of NextController
// ------------------------------------------------------------------------------------------------
