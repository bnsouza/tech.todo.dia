import {PostHandler} from "./data/postHandler";
import {TopicHandler} from "./data/topicHandler";

export class NextTopicController {
  private postHandler: PostHandler;
  private topicHandler: TopicHandler;
  private coveredTopics: string;

  constructor() {
    this.postHandler = new PostHandler("./automation/data/posts.json");
    this.topicHandler = new TopicHandler("./automation/data/topics.json", this.getActiveLevel());
    this.syncLevels();
    this.coveredTopics = "";
  }

  public getActiveLevel(): string {
    return this.postHandler.getLevel();
  }

  public syncLevels() {
    if (this.getActiveLevel() !== this.topicHandler.getLevel()) {
      this.postHandler.setLevel(this.topicHandler.getLevel());
    }
  }

  public getNextTopicPrompts(): {systemPrompt: string; nextTopicPrompt: string} {
    // Get the covered topics, the first instruction, the progression instruction, and the actual level
    this.getCoveredTopics();
    const firstInstruction = this.getRemainingTopicsInstruction();
    const progressionInstruction = this.topicHandler.getProgression();
    const actualLevel = this.getActiveLevel();

    // Prepare the final prompts
    const finalPrompt = {
      systemPrompt:
        "Act like a professional content strategist specializing in educational short-form videos " +
        "for Instagram and TikTok. Your expertise is in creating engaging, bite-sized content that " +
        "builds foundational knowledge of technology topics and gradually increases in complexity.\n" +
        "Respond in the following JSON format without any additional text or formatting:\n" +
        '`{"title": "", "topic": "", "description": "", "justification": ""}`',
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

  public getCoveredTopics(): string {
    // Get all covered topics separated by `,`
    this.coveredTopics =
      "`" +
      this.postHandler
        .getAllPosts()
        .map((post) => post.topic)
        .join("`, `") +
      "`";
    return this.coveredTopics;
  }

  public getRemainingTopicsInstruction(): string {
    // Get all remaining topics for the current level
    const remainingTopics = this.topicHandler.getAllRemainingTopics(this.coveredTopics);

    // If there are remaining topics, suggest one of them
    if (remainingTopics.length) {
      return (
        "Based on the current progression of the series, suggest one and only one topic from the following list: `" +
        remainingTopics.join("`, `") +
        "`"
      );
    }

    // There are no remaining topics in this level, move to the next level
    const nextLevel = this.topicHandler.setNextLevel();

    // If we covered all available topics, set the AI free to suggest a new topic
    if (!nextLevel) {
      return "The series has covered all available topics. Please suggest a new topic.";
    }

    // There are still new levels, suggest to review the next level
    this.postHandler.setLevel(nextLevel);
    return (
      "The series has covered all available topics of this level. " +
      "Please review the next level items and feel free to suggest topic not covered yet and not listed " +
      "in the next level items or advance to one of the next level topics:" +
      this.topicHandler.getAllRemainingTopics().join(", ")
    );
  }

  public addPost(title: string, topic: string, description: string, justification: string): number {
    const index = this.postHandler.addPost(title, topic, description, justification);
    return index;
  }

  public updatePost(index: number, key: string, value: string): void {
    const topic = this.postHandler.getPost(index);
    if (!topic) {
      throw new Error("Topic not found");
    }
    // @ts-expect-error - We know that the key exists in the topic object
    topic[key] = value;
    this.postHandler.updatePost(index, topic);
  }
}
