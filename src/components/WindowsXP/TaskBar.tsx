// ------------------------------------------------------------------------------------------------

import React from "react";
import {useTranslations} from "next-intl";

// ------------------------------------------------------------------------------------------------

export const TaskBar: React.FC = () => {
  const t = useTranslations("Labels");

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 flex items-center bg-gradient-to-r from-[#235CDC] to-[#378EDF]">
      <div className="h-12 pl-4 pr-5 flex items-center gap-2 bg-gradient-to-b from-[#40AB3D] to-[#328A2E] rounded-r-xl">
        <div className="size-10 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 80 80" className="size-8">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="rgba(0,0,0,0.8)" />
              </filter>
            </defs>
            <rect x="8" y="8" width="28" height="28" className="fill-red-500" filter="url(#shadow)" />
            <rect x="44" y="8" width="28" height="28" className="fill-green-500" filter="url(#shadow)" />
            <rect x="8" y="44" width="28" height="28" className="fill-blue-500" filter="url(#shadow)" />
            <rect x="44" y="44" width="28" height="28" className="fill-yellow-500" filter="url(#shadow)" />
          </svg>
        </div>
        <span className="text-white text-xl font-bold italic tracking-wide">{t("Start")}</span>
      </div>
      <div className="flex-1" />
      <div className="h-12 flex items-center gap-2 px-2 text-white">
        <div className="p-2 bg-blue-900/30 rounded-full size-8 text-xl font-bold flex items-center justify-center">
          ?
        </div>
        <div className="w-1 h-8 bg-blue-300/30" />
        <div className="bg-blue-900/50 rounded px-3 py-1 text-xl font-bold">{t("Hour")}</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
