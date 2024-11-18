// ------------------------------------------------------------------------------------------------

import * as fs from "fs";

// ------------------------------------------------------------------------------------------------
// Handler class to manage JSON data
export class JSONController<T> {
  private filePath: string;

  // ----------------------------------------------------------------------------------------------
  // Constructor
  constructor(filePath: string) {
    this.filePath = filePath;
    this.ensureFileExists();
  }

  // ----------------------------------------------------------------------------------------------
  // Ensure the file exists before reading or writing and create it if it doesn't
  private ensureFileExists(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}));
    }
  }

  // ----------------------------------------------------------------------------------------------
  // Read the JSON data from the file
  public read(): T {
    const data = fs.readFileSync(this.filePath, "utf8");
    return JSON.parse(data) as T;
  }

  // ----------------------------------------------------------------------------------------------
  // Write the JSON data to the file
  public write(data: T): void {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  // ----------------------------------------------------------------------------------------------
} // End of JSONController
// ------------------------------------------------------------------------------------------------
