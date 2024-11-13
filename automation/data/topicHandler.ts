import {Topic, TopicSchema} from "./types";
import {JSONHandler} from "./jsonHandler";

export class TopicHandler extends JSONHandler<TopicSchema> {
  private level: string;
  private progression: string;
  private levelTopics: Topic[];

  constructor(filePath: string, level?: string) {
    // Call the parent constructor
    super(filePath);
    this.level = level || "";

    // Read the data from the file
    const data = this.read();

    // If no level is provided, set the level to the first level in the data
    if (this.level === "") {
      const levels = Object.keys(data);
      this.level = levels[0];
    }

    // Set the progression and topics based on the level
    this.progression = data[this.level].progression;
    this.levelTopics = data[this.level].topics;
  }

  public getLevel(): string {
    return this.level;
  }

  public getProgression(): string {
    return this.progression;
  }

  public getAllTopics(): Topic[] {
    return this.levelTopics;
  }

  public getAllRemainingTopics(coveredTopics: string = ""): string[] {
    const topics = this.getAllTopics()
      .filter((t) => !coveredTopics.includes(t.topic))
      .map((t) => t.topic);

    // Shuffle the topics to make the suggestions less predictable
    for (let i = topics.length - 1; i > 0; i--) {
      // eslint-disable-next-line @remotion/deterministic-randomness
      const j = Math.floor(Math.random() * (i + 1));
      [topics[i], topics[j]] = [topics[j], topics[i]];
    }
    return topics;
  }

  public setNextLevel(): string {
    const data = this.read();
    const levels = Object.keys(data);
    const currentLevelIndex = levels.indexOf(this.level);
    this.level = levels[currentLevelIndex + 1] || "";
    return this.level;
  }
}
