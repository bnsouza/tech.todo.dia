// ------------------------------------------------------------------------------------------------

export type AudioProps = {
  text: string;
  audio: string;
  segments: ScriptSegment[];
  duration: number;
};

// ------------------------------------------------------------------------------------------------

export type Media = {
  original: string;
  file: string;
  width?: number;
  height?: number;
  duration?: number;
};

// ------------------------------------------------------------------------------------------------

export type Post = {
  title?: string;
  topic?: string;
  level?: string;
  description?: string;
  justification?: string;
  difficulty?: string;
  script?: Script;
  caption?: string;
};

// ------------------------------------------------------------------------------------------------

export type PostSchema = {
  posts: Post[];
  level: string;
};

// ------------------------------------------------------------------------------------------------

export type Script = {
  hook?: ScriptSequence;
  intro?: ScriptSequence;
  explanation?: ScriptSequence;
  example?: ScriptSequence;
  engagement?: ScriptSequence;
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
