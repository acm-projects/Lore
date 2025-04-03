// bedrockStoryGenerator.js
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

// Initialize Amazon Bedrock client
const bedrock = new BedrockRuntimeClient();

/**
 * Generates story content based on the provided parameters
 * @param {string} prompt - The creative prompt for story generation
 * @param {string} currentStory - The existing story content (empty for first round)
 * @param {number} roundNumber - The current round number (starts at 1)
 * @param {boolean} isFinal - Whether this is the final round
 * @returns {Promise<string>} The generated story text
 */
async function generateStory(
  prompt,
  currentStory = "",
  roundNumber = 1,
  isFinal = false
) {
  // 🧠 Prompt logic for final round vs normal
  let instruction;
  if (isFinal) {
    instruction =
      `With this story:\n\n${currentStory}\n\n` +
      `write a conclusion in three short, numbered paragraphs following this prompt: ${prompt}. ` +
      "End with a new line and ...";
  } else if (roundNumber === 1) {
    instruction =
      `Provide only three short numbered paragraphs to start the story using this prompt:\n${prompt}\n` +
      "After the three paragraphs, do not include any further explanation or comments. End with a new line and ...";
  } else {
    instruction =
      `Using the following prompt: ${prompt}, generate 3 short numbered paragraphs to continue the following story:\n\n` +
      `${currentStory}\n\n` +
      "Only generate 3 short paragraphs. Do not include anything else after. End with a new line and ...";
  }

  // AI Generation Configuration
  const payload = {
    prompt: instruction,
    temperature: 0.9,
  };

  const body = JSON.stringify(payload);
  const modelId = "meta.llama3-3-70b-instruct-v1:0";

  try {
    const command = new InvokeModelCommand({
      body,
      modelId,
      accept: "application/json",
      contentType: "application/json",
    });

    const response = await bedrock.send(command);
    const responseBody = JSON.parse(Buffer.from(response.body).toString());
    return (
      responseBody.generation ||
      responseBody.output ||
      "Error generating response"
    );
  } catch (error) {
    throw new Error(`Error generating story: ${error.message}`);
  }
}

/**
 * Summarizes a complete story into a single paragraph
 * @param {string} fullStory - The complete story text to summarize
 * @returns {Promise<string>} The summarized text
 */
async function summarizeStory(fullStory) {
  if (!fullStory) {
    throw new Error("No story provided for summarization");
  }

  // Instruction for summarization
  const instruction = `Return a one paragraph summary of the story:\n\n${fullStory}\n\n Label the beginning of the paragraph with Summary: `;

  const payload = {
    prompt: instruction,
    temperature: 0.6,
  };

  const body = JSON.stringify(payload);
  const modelId = "meta.llama3-3-70b-instruct-v1:0";

  try {
    const command = new InvokeModelCommand({
      body,
      modelId,
      accept: "application/json",
      contentType: "application/json",
    });

    const response = await bedrock.send(command);
    const responseBody = JSON.parse(Buffer.from(response.body).toString());
    return (
      responseBody.generation ||
      responseBody.output ||
      "Error generating summary"
    );
  } catch (error) {
    throw new Error(`Error summarizing story: ${error.message}`);
  }
}

module.exports = {
  generateStory,
  summarizeStory,
};
