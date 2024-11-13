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

export type Script = {
  hook?: Sequence[];
  intro?: Sequence[];
  explanation?: Sequence[];
  example?: Sequence[];
  engagement?: Sequence[];
};

export type Sequence = {
  text: string;
  media: string;
  duration: number;
};

export type PostSchema = {
  posts: Post[];
  level: string;
};

export type Topic = {
  topic: string;
  tags: string[];
};

export type TopicLevel = {
  progression: string;
  topics: Topic[];
};

export type TopicSchema = Record<string, TopicLevel>;
