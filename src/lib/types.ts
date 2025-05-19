// ------------------------------------------------------------------------------------------------

export type AudioProps = {
  text: string;
  audio: string;
  duration: number;
};

// ------------------------------------------------------------------------------------------------

export type KenBurnsDirection = "up" | "down" | "left" | "right" | "none";

// ------------------------------------------------------------------------------------------------

export type Media = {
  original: string;
  file: string;
  width?: number;
  height?: number;
  duration?: number;
  kenBurnsDirection?: KenBurnsDirection;
};

// ------------------------------------------------------------------------------------------------

export type Post = {
  language: string;
  title: string;
  topic: string;
  level: number;
  description: string;
  justification: string;
  difficulty: string;
  script: Script;
  caption?: string;
};

// ------------------------------------------------------------------------------------------------

export type PostSchema = {
  posts: Post[];
  level: string;
};

// ------------------------------------------------------------------------------------------------

export type Script = {
  hook: ScriptSequence;
  intro: ScriptSequence;
  explanation: ScriptSequence;
  example: ScriptSequence;
  engagement: ScriptSequence;
};

// ------------------------------------------------------------------------------------------------

export type ScriptTexts = {
  [key: string]: string;
};

// ------------------------------------------------------------------------------------------------

export type ScriptSequence = {
  text: string;
  audio: string;
  segments: ScriptSegment[];
  duration: number;
  media?: Media[];
};

// ------------------------------------------------------------------------------------------------

export type ScriptSegment = {
  text: string;
  startMs: number;
  endMs: number;
};

// ------------------------------------------------------------------------------------------------

export type Topic = {
  topic: string;
  tags: string[];
};

// ------------------------------------------------------------------------------------------------

export type TopicLevel = {
  progression: string;
  topics: Topic[];
};

// ------------------------------------------------------------------------------------------------

export type TopicSchema = Record<string, TopicLevel>;

// ------------------------------------------------------------------------------------------------
