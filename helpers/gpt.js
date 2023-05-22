import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * @param {string} something - thing that will get a random of it
 * @returns {string} the prompt for gpt
 */
function generatePrompt(something) {
  return `Please give me a random  ${something}`;
}

// eslint-disable-next-line require-jsdoc
export async function getRandomFromGpt(something) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: generatePrompt(something),
    temperature: 0.6,
  });

  return completion.data?.choices[0]?.text ?? 'Sorry I don\'t know what you mean';
}