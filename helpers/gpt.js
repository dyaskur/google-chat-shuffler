import OpenAI from 'openai';
import Redis from 'ioredis';
import crypto from 'crypto';

/**
 * Get random list from GPT based on user input context.
 *
 * @param {string} something - user input context
 *
 * @returns {object|null} - object with keys: context, expectedCount, items
 *
 * @example
 * getRandomFromGpt('animals')
 * // => {context: 'animals', expectedCount: 100, items: ["pig", "panda", "monkey", ...]}
 *
 * @example
 * getRandomFromGpt('give me 3 random big animals')
 * // => {context: "big animals", expectedCount: 3, items: ["pig", "panda", "monkey"]}
 *
 * @example
 * getRandomFromGpt('give me random number between 5 and 10')
 * // => {context: "random_number", expectedCount: 1, items: ["5-10"]}
 */
export async function getRandomFromGpt(something) {
  const somethingMd5 = crypto.createHash('md5').update(something).digest('hex');
  const client = new Redis(process.env.REDIS_URL);
  const lastAnswers = await client.get(somethingMd5);
  const openai = new OpenAI({
    apiKey: process.env?.OPENAI_API_KEY,
  });
  const command = 'Generate a list based on user input context.' +
    'if user says animals, you list 100 animals. ' +
    'if user give list to random just give me back the list without addition' +
    'if user ask random number, just give me the range' +
    'Even if a number is requested, always output 100 items.' +
    'Format: first item as the input context, second item as the requested number. ' +
    'e.g "give me 2 random big animals", answer: big animals;;2;;pig;;panda;;monkey;;aardvark;;...' +
    'e.g "give me random number between 5 and 10", answer: random_number;;1;;5-10' +
    'Respond directly, no extra phrases or numbering.';
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: command,
      },
      {role: 'user', content: something},
    ],
    temperature: 1,
    frequency_penalty: 0.1,
    max_completion_tokens: 300,
  });


  if (completion?.choices.length > 0) {
    const completionAnswer = completion.choices.map((a) => a.message.content.replace(/(\r\n|\n|\r)/gm, '')).join('\n');
    console.log(completionAnswer);
    const options = completionAnswer.replace(/(;;;|;;&)+/g, ';;').split(';;');
    if (options.length < 3) {
      return null;
    }
    const context = options[0];
    const expectedCount = parseInt(options[1]);
    const items = options.slice(2);
    return {
      context,
      expectedCount,
      items,
    };
  }
  // await client.set(somethingMd5, lastAnswers ? lastAnswers + ', ' + answer : answer);
  return null;
}


