// ------------------------------------------------------------------------------------------------

import {useEffect, useState} from "react";
import {IntlProvider} from "next-intl";
import {Audio, CalculateMetadataFunction, Sequence, staticFile, useVideoConfig} from "remotion";
import {z} from "zod";

import {BlueScreenOfDeath} from "./components/Sections/BSOD";
import {Engagement} from "./components/Sections/Engagement";
import {Example} from "./components/Sections/Example";
import {Explanation} from "./components/Sections/Explanation";
import {Hook} from "./components/Sections/Hook";
import {Intro} from "./components/Sections/Intro";
import {Windows} from "./components/WindowsXP/Windows";
import {loadFont} from "./lib/load-font";
import {Post, Script} from "./lib/types";
import {breathDurationFrames, getFileExists, prepareScripts} from "./lib/utils";
import {loadMessages} from "./locales/messagesLoader";

// ------------------------------------------------------------------------------------------------

// How many captions should be displayed at a time?
// Try out:
// - 1500 to display a lot of words at a time
// - 200 to only display 1 word at a time
export const SWITCH_CAPTIONS_EVERY_MS = 900;

export const PLAYBACK_RATE = parseFloat(process.env.AUTOMATION_PLAYBACK_SPEED ?? "1");

// Sections of the script
const sections: (keyof Script)[] = ["hook", "intro", "explanation", "example", "engagement"];

// ------------------------------------------------------------------------------------------------

export const reelVideoSchema = z.object({
  src: z.string(),
});

// ------------------------------------------------------------------------------------------------

export const calculateVideoMetadata: CalculateMetadataFunction<z.infer<typeof reelVideoSchema>> = async ({props}) => {
  // Set the frames per second
  const fps = 30;

  // Fetch the post data
  const res = await fetch(props.src);
  const post = (await res.json()) as Post;

  // Calculate the duration of the video
  let durationInFrames = 0;
  for (const sectionKey of sections) {
    const script = post.script[sectionKey];
    durationInFrames += script.duration + 2 * breathDurationFrames(fps);
  }

  // Add the duration of the BSOD
  durationInFrames += 30;

  // Return the frames per second and the duration of the video
  return {
    fps,
    durationInFrames,
  };
};

// ------------------------------------------------------------------------------------------------

export const Reel: React.FC<{src: string}> = ({src}) => {
  // Remotion hook to get the current frame
  const {fps} = useVideoConfig();

  // React States
  const [post, setPost] = useState<Post | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [locale, setLocale] = useState<string>("en");

  // useEffect to load the post data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load the font to be used in the video
        await loadFont();

        // Fetch the post data and prepare the scripts
        const response = await fetch(src);
        const data: Post = await response.json();
        const preparedScript = prepareScripts(data.script);

        // Set the prepared script in the post data
        data.script = {
          hook: preparedScript.hook,
          intro: preparedScript.intro,
          explanation: preparedScript.explanation,
          example: preparedScript.example,
          engagement: preparedScript.engagement,
        };

        // Set the post data, locale and messages in the states
        setPost(data);
        setLocale(data.language);
        loadMessages(data.language).then(setMessages);
      } catch (error) {
        console.error("Erro ao carregar o arquivo de configuração:", error);
      }
    };

    fetchData();
  }, [locale, src]);

  // If the post data is not loaded yet, return a loading message
  if (!post) {
    return <div>...</div>;
  }

  // Initialize the current frame for the video
  let currentFrame = 0;

  // Function to get the component for each section
  const getSectionComponent = (sectionKey: string) => {
    switch (sectionKey) {
      case "hook":
        return Hook;
      case "intro":
        return Intro;
      case "explanation":
        return Explanation;
      case "example":
        return Example;
      case "engagement":
        return Engagement;
      default:
        return () => null;
    }
  };

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Windows level={post.level} title={post.title}>
        {sections.map((sectionKey) => {
          const script = post.script[sectionKey];
          const SectionComponent = getSectionComponent(sectionKey);
          const component = <SectionComponent key={sectionKey} script={script} startFrame={currentFrame} />;
          currentFrame += script.duration + 2 * breathDurationFrames(fps);
          return component;
        })}
      </Windows>
      {getFileExists(staticFile("music/bgMusic.mp3")) && (
        <Audio src={staticFile("music/bgMusic.mp3")} volume={0.1} endAt={currentFrame} />
      )}
      <Sequence from={currentFrame} durationInFrames={30}>
        <BlueScreenOfDeath />
      </Sequence>
    </IntlProvider>
  );
};

// ------------------------------------------------------------------------------------------------
