import {AbsoluteFill, Audio, staticFile, Sequence} from "remotion";
import {Window} from "../components/WindowsXP/Window";
import {TaskBar} from "../components/WindowsXP/TaskBar";
import {Background} from "../components/WindowsXP/Background";
import NetworkAnimation from "./Video01";

export const TodayVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("WWW.mp3")} playbackRate={1.25} />
      <Background>
        <Window title="World Wide Web">
          <Sequence durationInFrames={120}>
            <NetworkAnimation />
          </Sequence>
        </Window>
      </Background>
      <TaskBar />
    </AbsoluteFill>
  );
};
