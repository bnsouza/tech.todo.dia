// ------------------------------------------------------------------------------------------------

import {continueRender, delayRender, staticFile} from "remotion";

// ------------------------------------------------------------------------------------------------

export const Font = "RobotoCondensed-Bold";

// ------------------------------------------------------------------------------------------------

let loaded = false;

// ------------------------------------------------------------------------------------------------

export const loadFont = async (): Promise<void> => {
  if (loaded) {
    return Promise.resolve();
  }

  const waitForFont = delayRender();

  loaded = true;

  const font = new FontFace(Font, `url('${staticFile("fonts/RobotoCondensed-Bold.ttf")}') format('truetype')`);

  await font.load();
  document.fonts.add(font);

  continueRender(waitForFont);
};

// ------------------------------------------------------------------------------------------------
