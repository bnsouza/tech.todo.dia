import React, {useMemo} from "react";
import {useTranslations} from "next-intl";
import {spring, useCurrentFrame, useVideoConfig} from "remotion";

import {TitleBar} from "./TitleBar";

// ------------------------------------------------------------------------------------------------

// Função pseudo-aleatória determinística baseada no frame
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Função para gerar a duração da pausa (em frames)
const getRandomInterval = (seed: number) => {
  // Define intervalos possíveis (em frames)
  const intervals = [
    65, 40, 51, 61, 41, 87, 56, 89, 98, 49, 48, 90, 94, 91, 80, 81, 74, 35, 18, 10, 75, 45, 25, 43, 24, 60, 47, 37, 84,
    55, 46, 50, 23, 42, 15, 44, 53, 34, 66, 67,
  ];
  const rand = pseudoRandom(seed);
  return intervals[Math.floor(rand * intervals.length)];
};

// Função para gerar o incremento de progresso (em porcentagem)
const getRandomIncrement = (seed: number) => {
  // Define incrementos possíveis (em porcentagem)
  const increments = [
    5.23, 5.21, 1.12, 5.41, 5.52, 4.56, 3.1, 1.69, 1.32, 6.09, 5.5, 7.31, 4.32, 1.73, 8.4, 8.84, 9.58, 4.56, 4.22, 7.25,
    8.95, 2.03, 9.61, 6.95, 4.63, 2.57, 2.75, 4.84, 3.35, 4.56, 4.35, 5.7, 4.45, 4.58, 5.54, 5.28, 5.9, 2.2, 5.78, 4.54,
    7.35, 4.05, 2.78, 5.56, 4.95, 6.55, 4.56, 4.44, 6.32, 4.53,
  ];
  const rand = pseudoRandom(seed + 1000); // Offset para variar
  return increments[Math.floor(rand * increments.length)];
};

// ------------------------------------------------------------------------------------------------

const videoSize = Math.floor(Math.random() * (9000 - 1000 + 1)) + 1000;

// ------------------------------------------------------------------------------------------------

export const Download: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const t = useTranslations("Labels");

  // Gerar o perfil de progresso com intervalos e incrementos variados
  const progressArray = useMemo(() => {
    const progress = Array(durationInFrames).fill(0);
    let currentProgress = 0;
    let currentFrame = 0;

    while (currentFrame < durationInFrames && currentProgress < 100) {
      // Determinar o intervalo de frames para a próxima atualização
      const interval = getRandomInterval(currentFrame);

      // Determinar o incremento de progresso para esta atualização
      let increment = getRandomIncrement(currentFrame);

      // Ajustar o incremento se estiver próximo de 100%
      if (currentProgress + increment > 100) {
        increment = 100 - currentProgress;
      }

      // Atualizar o progresso nos frames do intervalo
      for (let f = currentFrame; f < currentFrame + interval && f < durationInFrames; f++) {
        progress[f] = currentProgress;
      }

      // Atualizar o progresso após o intervalo
      currentProgress += increment;
      for (let f = currentFrame + interval; f < currentFrame + interval + interval && f < durationInFrames; f++) {
        progress[f] = currentProgress;
      }

      // Avançar o frame atual
      currentFrame += interval;
    }

    // Garantir que todos os frames após o último incremento estejam a 100%
    for (let f = 0; f < durationInFrames; f++) {
      if (progress[f] === 0 && currentProgress >= 100) {
        progress[f] = 100;
      } else if (f > 0 && progress[f] === 0) {
        progress[f] = progress[f - 1];
      }
    }

    return progress;
  }, [durationInFrames]);

  // Obter o progresso atual do array
  const percentageComplete = frame < 65 ? 0 : (progressArray[frame] ?? 100);
  const videoComplete = videoSize * (percentageComplete / 100);

  const windowScale = spring({
    frame,
    fps,
    config: {mass: 1, damping: 20, stiffness: 90},
    durationInFrames: 10,
  });

  const worldSpinner = () => {
    const worldEmojis = ["🌎", "🌍", "🌏"];
    const frameDividedBy10 = Math.floor(frame / 10);
    const index = frameDividedBy10 % worldEmojis.length;
    return worldEmojis[index];
  };

  return (
    <div
      className="rounded-t-lg shadow-lg w-1/2"
      style={{
        fontFamily: "Tahoma, sans-serif",
        transform: `scale(${windowScale})`,
      }}>
      <TitleBar title={t("Download")} emoji="📹" />
      <div className="relative p-2 pt-0 bg-blue-700">
        <div className="bg-[#ebe9da] flex flex-col items-center p-4">
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{worldSpinner()}</div>
              <div>
                <p className="text-md font-bold">{t("DownloadFile")}</p>
                <p className="text-md text-gray-600">{t("DownloadFrom")}</p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path
                d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2M6 14 L3.2 19.5"
                fill="#feed87"
              />
            </svg>
          </div>
          <div className="h-5 w-full bg-white border border-[#919B9C] rounded relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 via-green-400 to-green-600 transition-all duration-100 ease-linear"
              style={{width: `${percentageComplete}%`}}
            />
          </div>
          <div className="mt-4 flex justify-between text-md w-full">
            <span>
              {percentageComplete === 0
                ? t("DownloadEstimating")
                : `${percentageComplete.toFixed(2)}% ${t("DownloadComplete")}`}
            </span>
            <span>
              {videoComplete.toFixed(0)} MB {t("DownloadOf")} {videoSize} MB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
