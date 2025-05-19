// ------------------------------------------------------------------------------------------------

import React from "react";
import {useTranslations} from "next-intl";

import {Background} from "./Background";
import {DifficultyLevel} from "./DifficultyLevel";
import {Download} from "./Download";
import {InternetExplorer} from "./InternetExplorer";
import {TaskBar} from "./TaskBar";

// ------------------------------------------------------------------------------------------------

export const Windows: React.FC<{level: number; title: string; children: React.ReactNode}> = ({
  level,
  title,
  children,
}) => {
  const t = useTranslations("Labels");

  return (
    <>
      <Background>
        <div className="flex items-center justify-center w-full space-x-8">
          <DifficultyLevel level={level} />
          <Download />
        </div>
        <InternetExplorer title={`${title} - @${t("igAccount")}`}>{children}</InternetExplorer>
      </Background>
      <TaskBar />
    </>
  );
};

// ------------------------------------------------------------------------------------------------
