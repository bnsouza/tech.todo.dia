import {generateText} from "ai";
import {openai} from "@ai-sdk/openai";
import dotenv from "dotenv";
import {NextTopicController} from "./controller";

dotenv.config();

async function main() {
  printLine();
  console.log("Starting the script...");
  printLine();
  await getNextTopic();
}

async function getNextTopic(): Promise<void> {
  const controller = new NextTopicController();
  const {systemPrompt, nextTopicPrompt} = controller.getNextTopicPrompts();

  console.log(JSON.stringify({systemPrompt, nextTopicPrompt}, null, 2));
  printLine();

  const {text} = await generateText({
    model: openai("gpt-4-turbo"),
    system: systemPrompt,
    prompt: nextTopicPrompt,
  });

  console.log(text);
  printLine();

  const post = JSON.parse(text);
  const index = controller.addPost(post.title, post.topic, post.description, post.justification);
  console.log("Added topic at index:", index);
  printLine();
}

function printLine() {
  const largura = process.stdout.columns || 80; // Define largura padrão de 80 se não disponível
  const linha = "=".repeat(largura);
  console.log(linha);
}

main().catch(console.error);
