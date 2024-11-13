import {Post, PostSchema} from "./types";
import {JSONHandler} from "./jsonHandler";

export class PostHandler extends JSONHandler<PostSchema> {
  private level: string;
  private posts: Post[];

  constructor(filePath: string) {
    super(filePath);
    const {level, posts} = this.read();
    this.level = level ?? "";
    this.posts = posts ?? [];
    this.updateData();
  }

  public getLevel(): string {
    return this.level;
  }

  public setLevel(level: string): void {
    this.level = level;
    this.updateData();
  }

  public getAllPosts(): Post[] {
    return this.posts.filter((post) => post.level === this.level);
  }

  public getPost(index: number): Post | null {
    if (index >= 0 && index < this.posts.length) {
      return this.posts[index];
    }
    return null;
  }

  public addPost(title: string, topic: string, description: string, justification: string): number {
    const post: Post = {title, topic, level: this.level, description, justification};
    this.posts.push(post);
    this.updateData();
    return this.posts.length - 1;
  }

  public updatePost(index: number, post: Post): void {
    if (index >= 0 && index < this.posts.length) {
      this.posts[index] = post;
      this.updateData();
    } else {
      throw new Error("Index out of bounds");
    }
  }

  public deletePost(index: number): void {
    if (index >= 0 && index < this.posts.length) {
      this.posts.splice(index, 1);
      this.updateData();
    } else {
      throw new Error("Index out of bounds");
    }
  }

  public updateData(): void {
    this.write({level: this.level, posts: this.posts});
  }
}
