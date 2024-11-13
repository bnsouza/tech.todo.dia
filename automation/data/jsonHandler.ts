import * as fs from "fs";

export class JSONHandler<T> {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.ensureFileExists();
  }

  private ensureFileExists(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}));
    }
  }

  public read(): T {
    const data = fs.readFileSync(this.filePath, "utf8");
    return JSON.parse(data) as T;
  }

  public write(data: T): void {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }
}
