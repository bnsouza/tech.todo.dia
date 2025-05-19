// ------------------------------------------------------------------------------------------------

import React from "react";
import {ArrowLeft, ArrowRight, ChevronDown, ChevronRight, FileCode} from "lucide-react";
import {useTranslations} from "next-intl";
import {spring, useCurrentFrame} from "remotion";

import {TitleBar} from "./TitleBar";

// ------------------------------------------------------------------------------------------------

export const InternetExplorer: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => {
  const frame = useCurrentFrame();
  const t = useTranslations("Labels");

  const windowScale = spring({
    frame,
    fps: 30,
    config: {mass: 1, damping: 20, stiffness: 90},
    durationInFrames: 10,
  });

  return (
    <div
      className="w-full mx-auto rounded-t-lg shadow-lg"
      style={{
        fontFamily: "Tahoma, sans-serif",
        transform: `scale(${windowScale})`,
      }}>
      <TitleBar title={title} />
      <div className="relative p-2 pt-0 bg-blue-700">
        <div className="bg-[#ebe9da]">
          <ul className="flex space-x-6 py-1 px-4 border-b border-[#cac6b1]">
            <li>{t("File")}</li>
            <li>{t("Edit")}</li>
            <li>{t("View")}</li>
            <li>{t("Favorites")}</li>
            <li>{t("Tools")}</li>
            <li>{t("Help")}</li>
          </ul>
          <div className="flex items-center py-2 px-3 space-x-4">
            <div className="flex items-center space-x-2">
              <div className="size-8 flex items-center justify-center bg-green-500 rounded-full border border-black border-opacity-20 text-white">
                <ArrowLeft />
              </div>
              <div className="size-8 flex items-center justify-center bg-gray-300 rounded-full border border-black border-opacity-20 text-white">
                <ArrowRight />
              </div>
            </div>
            <div className="flex items-center justify-between border border-[#799bb5] bg-white w-10/12 h-8 px-1">
              <div className="flex items-center space-x-2">
                <FileCode />
                <span>https://www.instagram.com/{t("igAccount")}</span>
              </div>
              <div className="flex items-center space-x-2 text-lg">
                <span>🔒</span>
                <span>🔍</span>
                <div className="bg-gradient-to-br from-indigo-200 to-indigo-300 text-indigo-800">
                  <ChevronDown />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-green-100">
                <ChevronRight />
              </div>
              <span>{t("Go")}</span>
            </div>
          </div>
          <div className="relative aspect-square bg-white border border-[#716f65]">{children}</div>
          <div className="flex items-center justify-between py-1 px-4">
            <span>{t("Done")}</span>
            <div className="flex items-center space-x-4">
              <div className="w-px h-8 bg-[#cac6b1]" />
              <span>🌐 {t("Internet")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
