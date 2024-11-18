// ------------------------------------------------------------------------------------------------
// Controller to handle the script creation process
export class ScriptController {
  private topic: string;

  // ----------------------------------------------------------------------------------------------
  // Constructor
  constructor(topic: string) {
    this.topic = topic;
  }

  // ----------------------------------------------------------------------------------------------
  // Prepare the next topic prompts
  public getPrompts(): {systemPrompt: string; nextTopicPrompt: string} {
    // Prepare the final prompts
    const finalPrompt = {
      systemPrompt:
        "Act like a professional content creator specializing in crafting engaging and educational " +
        "scripts for Instagram Reels. You have over 10 years of experience creating dynamic " +
        "short-form video scripts. Your role is to produce clear, concise, and captivating narration " +
        "texts for videos that explain complex topics to audiences with no prior knowledge.",
      nextTopicPrompt:
        "**Objective:**\n" +
        "Your task is to develop the narration text for a 90-second Instagram Reels video, " +
        "following the structure below. The language should be simple, conversational, and free " +
        "of excessive technical jargon. Focus solely on the text for each section.\n\n" +
        `### Topic: **${this.topic}**\n\n` +
        "**1. Impact Statement (5 seconds)**\n" +
        "- Write a powerful, attention-grabbing opening line to introduce the topic and hook the audience.\n" +
        '- Example: *"Want to level up your JavaScript skills? Let’s explore the magic of closures!"*\n\n' +
        "**2. Topic Introduction (10-15 seconds)**\n" +
        "- Provide a concise and engaging introduction to the topic.\n" +
        "- Use a simple analogy or relatable comparison if possible.\n" +
        '- Example: *"Closures let functions hold onto variables from their parent scope, even after that parent scope is gone."*\n\n' +
        "**3. Explanation and Functionality (20-30 seconds)**\n" +
        "- Offer a detailed yet digestible explanation of the topic, focusing on how it works and why it’s useful.\n" +
        '- Example: *"When you nest a function inside another, the inner one keeps access to the outer function’s variables. This is perfect for creating things like private variables or maintaining state."*\n\n' +
        "**4. Practical Example (20-25 seconds)**\n" +
        "- Present a practical example in simple terms, explaining its relevance.\n" +
        '- Example: *"Imagine a counter function that remembers the last number. It increments every time you call it, thanks to closures."*\n\n' +
        "**5. Engagement Question (5-10 seconds)**\n" +
        "- Close with a question that prompts viewers to engage in the comments.\n" +
        '- Example: *"Have you used closures before? What’s your favorite JavaScript trick? Let me know below!"*\n\n' +
        "### Final Notes:\n" +
        "- Keep the tone friendly and conversational, aiming to educate without overwhelming.\n" +
        "- Maintain a friendly and conversational tone to maximize viewer connection.\n" +
        "- Ensure the script maintains a seamless flow from introduction to conclusion.\n" +
        "- Take a deep breath and work on this problem step-by-step.",
    };

    return finalPrompt;
  }
  // ----------------------------------------------------------------------------------------------
} // End of ScriptController
// ------------------------------------------------------------------------------------------------
