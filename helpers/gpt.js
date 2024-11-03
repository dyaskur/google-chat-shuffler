import OpenAI from 'openai';
import Redis from 'ioredis';
import crypto from 'crypto';

/**
 * @param {string} something - thing that will get a random of it
 * @param {string} lastAnswers - last answers to generate new thing
 * @returns {string} the prompt for gpt
 */
function getSomethingToAsk(something, lastAnswers) {
  if (lastAnswers) {
    return `${something} (last answer: ${lastAnswers})`;
  }
  return `${something}`;
}

// eslint-disable-next-line require-jsdoc
export async function getRandomFromGpt(something) {
  const somethingMd5 = crypto.createHash('md5').update(something).digest('hex');
  const client = new Redis(process.env.REDIS_URL);
  const lastAnswers = await client.get(somethingMd5);
  const openai = new OpenAI({
    apiKey: process.env?.OPENAI_API_KEY,
  });
  console.log('lastAnswers', lastAnswers);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system', content: 'You are a system that generate randomly thing from user input. ' +
          'If user dont ask how many thing to generate, just give 1 result' +
          'don\'t use common answer.' +
          'if user says animals, you list 1000 animals from the database and pick at random,' +
          'to the point, no say \'sure\'' +
          '',
      },
      {role: 'user', content: getSomethingToAsk(something, lastAnswers)},
    ],
    temperature: 1,
    max_tokens: 75,
  });

  let answer = 'Sorry I don\'t know what you mean';
  if (completion?.choices.length > 0) {
    answer = completion.choices.map((a) => a.message.content.replace(/(\r\n|\n|\r)/gm, '')).join('\n');
  }
  await client.set(somethingMd5, lastAnswers ? lastAnswers + ', ' + answer : answer);
  return answer;
}

