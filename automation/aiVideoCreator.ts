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
  const debug = true;
  const musicCredits = "Music by Amaksi from Pixabay";

  const videoCreator = new VideoController({debug, musicCredits});
  await videoCreator.generateVideo();
}

// ------------------------------------------------------------------------------------------------
// Run the main function
main().catch(console.error);

// ------------------------------------------------------------------------------------------------
