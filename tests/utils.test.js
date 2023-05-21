import {extractMessage, getRandomWinners} from '../helpers/utils.js';

test('get the winner', () => {
  const names = ['Ibrahim', 'Isa', 'Moses', 'Ismail'];

  const winners = getRandomWinners(names);

  expect(winners.length).toEqual(1);

  const winners2 = getRandomWinners(names, 2);

  expect(winners2.length).toEqual(2);
});

const dataSet = [
  [
    'nganu "anu kae" super "sekali kae lo"', [
      'nganu', 'anu kae', 'super', 'sekali kae lo',
    ]],
  [
    'nganu kae', [
      'nganu', 'kae',
    ],
  ],
  [
    'z', [
      'z',
    ],
  ],
];
it.each(dataSet)('Extract message using regex', (input, expectedValue) => {
  const extractedStrings = extractMessage(input);

  expect(extractedStrings).toEqual(expectedValue);
});
