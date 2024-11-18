import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";

import {Background} from "../components/WindowsXP/Background";
import {TaskBar} from "../components/WindowsXP/TaskBar";
import {Window} from "../components/WindowsXP/Window";

type Script = {
  hook?: ScriptSequence;
  intro?: ScriptSequence;
  explanation?: ScriptSequence;
  example?: ScriptSequence;
  engagement?: ScriptSequence;
};

type ScriptSequence = {
  text: string;
  audio: string;
  duration: number;
  media?: string;
};

export const Reel: React.FC = (script: Script) => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("WWW.mp3")} playbackRate={1.25} />
      <Background>
        <Window title="World Wide Web">
          <Sequence durationInFrames={120}>{/*  */}</Sequence>
        </Window>
      </Background>
      <TaskBar />
    </AbsoluteFill>
  );
};
