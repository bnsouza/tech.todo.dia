import {Minus, Square, X} from "lucide-react";
import React from "react";

export const TitleBar: React.FC<{title: string}> = ({title}) => {
  return (
    <div className="h-12 bg-blue-700 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 p-2 flex justify-between items-center">
      <div className="text-white font-bold flex items-center space-x-4">
        <span className="text-2xl">🌐</span>
        <span className="text-xl">{title} - @tech.todo.dia</span>
      </div>
      <div className="flex gap-2">
        <div className="flex items-end justify-center size-8 bg-blue-500 text-white rounded-lg border border-black border-opacity-20">
          <Minus />
        </div>
        <div className="flex items-center justify-center size-8 bg-blue-400 text-white rounded-lg border border-black border-opacity-20">
          <Square />
        </div>
        <div className="flex items-center justify-center size-8 bg-red-500 text-white rounded-lg border border-black border-opacity-20">
          <X />
        </div>
      </div>
    </div>
  );
};
