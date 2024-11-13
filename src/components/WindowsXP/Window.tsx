import React from "react";
import {spring, useCurrentFrame, useVideoConfig} from "remotion";
import {TitleBar} from "./TitleBar";
import {ArrowLeft, ArrowRight, ChevronDown, ChevronRight, FileCode} from "lucide-react";

export const Window: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();

  const windowScale = spring({
    frame,
    fps: 30,
    config: {mass: 1, damping: 20, stiffness: 90},
    durationInFrames: 10,
  });

  return (
    <div
      className="w-11/12 mx-auto rounded-t-lg shadow-lg overflow-hidden -mt-64"
      style={{
        fontFamily: "Tahoma, sans-serif",
        height: height * 0.6,
        transform: `scale(${windowScale})`,
      }}>
      <TitleBar title={title} />
      <div className="relative p-2 pt-0 h-full bg-blue-700 overflow-hidden">
        <div className="absolute inset-x-2 top-0 bottom-14 overflow-hidden bg-[#EBE9DA]">
          <ul className="flex space-x-6 py-1 px-4 border-b border-[#CAC6B1]">
            <li>Arquivo</li>
            <li>Editar</li>
            <li>Visualizar</li>
            <li>Favoritos</li>
            <li>Ferramentas</li>
            <li>Ajuda</li>
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
            <div className="flex items-center justify-between border border-[#799BB5] bg-white w-10/12 h-8 px-1">
              <div className="flex items-center space-x-2">
                <FileCode />
                <span>https://www.instagram.com/tech.todo.dia</span>
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
              <span>Ir</span>
            </div>
          </div>
          <div className="relative aspect-square bg-white border border-[#716F65]">{children}</div>
          <div className="flex items-center justify-between py-1 px-4">
            <span>Concluído</span>
            <div className="flex items-center space-x-4">
              <div className="w-px h-8 bg-[#CAC6B1]" />
              <span>🌐 Internet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
