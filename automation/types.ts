// ------------------------------------------------------------------------------------------------

export type AudioProps = {
  text: string;
  audio: string;
  duration: number;
};

// ------------------------------------------------------------------------------------------------

export type Post = {
  title: string;
  topic: string;
  level: string;
  description?: string;
  justification?: string;
  difficulty?: string;
  tags?: string[];
  script?: Script;
  caption?: string;
};

// ------------------------------------------------------------------------------------------------

export type PostSchema = {posts: Post[]; level: string};

// ------------------------------------------------------------------------------------------------

export type Script = {
  hook?: Sequence;
  intro?: Sequence;
  explanation?: Sequence;
  example?: Sequence;
  engagement?: Sequence;
};

// ------------------------------------------------------------------------------------------------

export type ScriptTexts = {[key: string]: string};

// ------------------------------------------------------------------------------------------------

export type Sequence = {
  text: string;
  audio: string;
  duration: number;
  media?: string;
};

// ------------------------------------------------------------------------------------------------

export type Topic = {topic: string; tags: string[]};

// ------------------------------------------------------------------------------------------------

export type TopicLevel = {progression: string; topics: Topic[]};

// ------------------------------------------------------------------------------------------------

export type TopicSchema = Record<string, TopicLevel>;

// ------------------------------------------------------------------------------------------------
