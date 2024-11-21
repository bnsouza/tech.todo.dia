// ------------------------------------------------------------------------------------------------

import {Post, PostSchema} from "../types";
import {JSONController} from "./Json";

// ------------------------------------------------------------------------------------------------
// Handler class to manage posts data
export class PostController extends JSONController<PostSchema> {
  private level: string;
  private posts: Post[];

  // ----------------------------------------------------------------------------------------------
  // Constructor
  constructor(filePath: string) {
    super(filePath);
    const {level, posts} = this.read();
    this.level = level ?? "";
    this.posts = posts ?? [];
    this.updateData();
  }

  // ----------------------------------------------------------------------------------------------
  // Get the active level of difficulty
  public getLevel(): string {
    return this.level;
  }

  // ----------------------------------------------------------------------------------------------
  // Set the active level of difficulty
  public setLevel(level: string): void {
    this.level = level;
    this.updateData();
  }

  // ----------------------------------------------------------------------------------------------
  // Get the list of covered topics in the current level
  public getAllPosts(): Post[] {
    return this.posts.filter((post) => post.level === this.level);
  }

  // ----------------------------------------------------------------------------------------------
  // Get a specific post by index
  public getPost(index: number): Post | null {
    if (index >= 0 && index < this.posts.length) {
      return this.posts[index];
    }
    return null;
  }

  // ----------------------------------------------------------------------------------------------
  // Add a new post to the list of topics
  public addPost(post: Post): number {
    this.posts.push(post);
    this.updateData();
    return this.posts.length - 1;
  }

  // ----------------------------------------------------------------------------------------------
  // Update a post in the list of topics
  public updatePost(index: number, post: Post): void {
    if (index >= 0 && index < this.posts.length) {
      this.posts[index] = post;
      this.updateData();
    } else {
      throw new Error("Index out of bounds");
    }
  }

  // ----------------------------------------------------------------------------------------------
  // Delete a post from the list of topics
  public deletePost(index: number): void {
    if (index >= 0 && index < this.posts.length) {
      this.posts.splice(index, 1);
      this.updateData();
    } else {
      throw new Error("Index out of bounds");
    }
  }

  // ----------------------------------------------------------------------------------------------
  // Update the data in the file
  public updateData(): void {
    this.write({level: this.level, posts: this.posts});
  }

  // ----------------------------------------------------------------------------------------------
}
// ------------------------------------------------------------------------------------------------
