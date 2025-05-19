// ------------------------------------------------------------------------------------------------

import React from "react";
import {useTranslations} from "next-intl";
import {interpolate, spring, useCurrentFrame} from "remotion";

import {TitleBar} from "./TitleBar";

// ------------------------------------------------------------------------------------------------

const difficultyLevels = [
  {level: 1, name: "Basic"},
  {level: 2, name: "Beginner"},
  {level: 3, name: "Junior"},
  {level: 4, name: "Intermediate"},
  {level: 5, name: "Advanced"},
  {level: 6, name: "Senior"},
  {level: 7, name: "Expert"},
  {level: 8, name: "Specialist"},
  {level: 9, name: "Master"},
];

// ------------------------------------------------------------------------------------------------

interface DifficultyLevelProps {
  level: number;
}

// ------------------------------------------------------------------------------------------------

export const DifficultyLevel: React.FC<DifficultyLevelProps> = ({level}) => {
  const frame = useCurrentFrame();
  const t = useTranslations("Labels");
  const difficulty = difficultyLevels.find((d) => d.level === level) || difficultyLevels[0];

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const gaugeValue = interpolate(frame, [0, 30], [0, difficulty.level], {
    extrapolateRight: "clamp",
  });

  const shake = Math.sin(frame * 0.5) * 0.5;

  const getColor = (value: number) => {
    const hue = interpolate(value, [1, 9], [120, 0]);
    return `hsl(${hue}, 100%, 50%)`;
  };

  const arcPath = (value: number) => {
    const angle = interpolate(value, [0, 9], [0, Math.PI]);
    const x = Math.cos(angle - Math.PI);
    const y = Math.sin(angle - Math.PI);
    return `M -1 0 A 1 1 0 0 1 ${x} ${y}`;
  };

  const windowScale = spring({
    frame,
    fps: 30,
    config: {mass: 1, damping: 20, stiffness: 90},
    durationInFrames: 10,
  });

  return (
    <div
      className="rounded-t-lg shadow-lg w-1/2"
      style={{
        fontFamily: "Tahoma, sans-serif",
        transform: `scale(${windowScale})`,
      }}>
      <TitleBar title={t("Difficulty")} emoji="📊" />
      <div className="relative p-2 pt-0 bg-blue-700">
        <div className="bg-[#ebe9da] flex items-center p-2">
          <div
            className="relative bg-white rounded-xl border border-slate-400 px-4 pt-4 pb-3 flex items-center justify-end overflow-hidden w-full"
            style={{opacity}}>
            <div className="absolute flex flex-col justify-center text-black top-2 left-3">
              <div className="text-4xl tracking-tight font-semibold text-neutral-700">{t(difficulty.name)}</div>
              <div className="text-2xl tracking-tight text-neutral-500">
                {t("Level")} {difficulty.level}
              </div>
            </div>
            <svg viewBox="-1.1 -1.1 2.2 1.151" className="w-1/2" style={{maxHeight: "110px"}}>
              <path d={arcPath(9)} fill="none" stroke="#d0d0d0" strokeWidth="0.2" />
              <path d={arcPath(gaugeValue)} fill="none" stroke={getColor(gaugeValue)} strokeWidth="0.2" />
              <line
                x1="0"
                y1="0"
                x2={Math.cos((gaugeValue / 9) * Math.PI - Math.PI / 2 + shake * 0.05)}
                y2={Math.sin((gaugeValue / 9) * Math.PI - Math.PI / 2 + shake * 0.05)}
                stroke="#c90c0c"
                strokeWidth="0.03"
                transform="rotate(-90)"
              />
              <circle cx="0" cy="0" r="0.05" fill="#c90c0c" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
