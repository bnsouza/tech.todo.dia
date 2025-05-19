import React from "react";
import {AbsoluteFill, Audio, staticFile} from "remotion";

export const BlueScreenOfDeath: React.FC = () => {
  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-[#0000AA] text-white p-8 font-mono text-4xl">
      <Audio startFrom={8} src={staticFile("audio/sfx/error.mp3")} />
      <div className="flex flex-col justify-between max-w-4xl text-center space-y-20">
        <div className="flex flex-col space-y-20">
          <div className="text-5xl md:text-6xl font-bold">
            AVISO: ESTE VÍDEO FOI INTEIRAMENTE CRIADO POR INTELIGÊNCIA ARTIFICIAL
          </div>
          <p>Todo o código fonte deste projeto está disponível no GitHub. Link na bio.</p>
        </div>
        <div className="flex flex-col space-y-20">
          <div className="w-full border-t border-white my-6" />

          <div className="text-left space-y-2">
            <p>
              <strong>Informações Técnicas:</strong>
            </p>
            <p>*** STOP: 0x00000021 (0x00000008, 0x807C2030, 0x807C2038, 0x00000000)</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
