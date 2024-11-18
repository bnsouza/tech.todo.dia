// ------------------------------------------------------------------------------------------------

import dotenv from "dotenv";

import {VideoController} from "./controllers/Video";

// ------------------------------------------------------------------------------------------------
// Load environment variables
dotenv.config();

// ------------------------------------------------------------------------------------------------
// Main function
async function main() {
  // Configure your options here
  const language = "pt";
  const isDebug = true;
  const model = "gpt-4-turbo";
  const playbackRate = 1.25;
  const musicCredits = "Music by Amaksi from Pixabay";

  const videoCreator = new VideoController({language, debug: isDebug, model, playbackRate, musicCredits});
  await videoCreator.generateVideo();
}

// ------------------------------------------------------------------------------------------------
// Run the main function
main().catch(console.error);

// ------------------------------------------------------------------------------------------------
