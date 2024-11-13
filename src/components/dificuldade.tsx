"use client";

import {useState, useEffect} from "react";
import {motion} from "framer-motion";

const difficultyLevels = [
  {level: 1, name: "Básico"},
  {level: 2, name: "Novato"},
  {level: 3, name: "Júnior"},
  {level: 4, name: "Intermediário"},
  {level: 5, name: "Pleno"},
  {level: 6, name: "Sênior"},
  {level: 7, name: "Avançado"},
  {level: 8, name: "Especialista"},
  {level: 9, name: "Mestre"},
];

const colors = [
  "#22C55E", // Green
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#0EA5E9", // Light Blue
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#D946EF", // Fuchsia
];

export function Dificuldade({difficulty = 5}: {difficulty?: number}) {
  const [currentDifficulty, setCurrentDifficulty] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentDifficulty(difficulty);
    }, 500);
    return () => clearTimeout(timer);
  }, [difficulty]);

  return (
    <div className="w-full flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Nível de Dificuldade</span>
          <span className="text-sm font-medium text-gray-700">{currentDifficulty}/9</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(to right, ${colors.slice(0, currentDifficulty).join(", ")})`,
            }}
            initial={{width: "0%"}}
            animate={{width: `${(currentDifficulty / 9) * 100}%`}}
            transition={{duration: 1, ease: "easeInOut"}}
          />
        </div>
        <motion.div
          className="mt-2 text-center text-sm font-semibold"
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.5}}>
          {difficultyLevels[currentDifficulty - 1]?.name}
        </motion.div>
      </div>
    </div>
  );
}
