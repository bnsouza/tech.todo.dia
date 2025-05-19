// ------------------------------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import {bundle} from "@remotion/bundler";
import {renderMedia, selectComposition} from "@remotion/renderer";

// ------------------------------------------------------------------------------------------------
// Handler class to manage JSON data
export class RenderController {
  private post: any;

  // ----------------------------------------------------------------------------------------------
  // Constructor
  constructor(post: any) {
    this.post = post;
  }

  // ----------------------------------------------------------------------------------------------
  // Prepare the prompts for selecting b-roll footage
  public async renderVideo() {
    // Save the post data to a file for the video
    const filePath = path.resolve(__dirname, `../../public/post.json`);
    fs.writeFileSync(filePath, JSON.stringify(this.post, null, 2));

    // The composition you want to render
    const compositionId = "Reel";

    // You only have to create a bundle once, and you may reuse it
    // for multiple renders that you can parametrize using input props.
    const bundleLocation = await bundle({
      entryPoint: path.resolve(__dirname, "../../src/index.ts"),
    });

    // Get the composition you want to render. Pass `inputProps` if you
    // want to customize the duration or other metadata.
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
    });

    // Define the output location of the video
    const outputDir = path.resolve(__dirname, "../../out");
    const outputLocation = path.join(outputDir, `${compositionId}.mp4`);

    // Check if the output location already exists, if not create it
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(path.dirname(outputDir), {recursive: true});
    }

    // Render the video. Pass the same `inputProps` again
    // if your video is parametrized with data.
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation,
    });

    return outputLocation;
  }

  // ----------------------------------------------------------------------------------------------
} // End of RenderController
// ------------------------------------------------------------------------------------------------
