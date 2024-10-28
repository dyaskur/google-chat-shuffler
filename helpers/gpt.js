import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @param {string} something - thing that will get a random of it
 * @returns {string} the prompt for gpt
 */
function generatePrompt(something) {
  return `Please give me a random  ${something}`;
}

// eslint-disable-next-line require-jsdoc
export async function getRandomFromGpt(something) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{role: 'user', content: generatePrompt(something)}],
    temperature: 0.6,
    max_tokens: 65,
  });
  let answer = 'Sorry I don\'t know what you mean';
  if (completion?.choices.length > 0) {
    answer = completion.choices.map((a) => a.message.content.replace(/(\r\n|\n|\r)/gm, '')).join('\n');
  }
  return answer;
}
