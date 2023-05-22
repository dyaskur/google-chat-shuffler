import {getRandomFromGpt} from '../helpers/gpt.js';

test.skip('OpenAI test', async () => {
  const something = 'Animal';
  const completion = await getRandomFromGpt(something);
  console.log(completion.data?.choices[0].text);
});
