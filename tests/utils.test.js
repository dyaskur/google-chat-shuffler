import {
  extractConfig,
  extractMessageAndConfig,
  extractMessageByDoubleQuote,
  getRandomWinners,
} from '../helpers/utils.js';

test('get the winner', () => {
  const names = ['Ibrahim', 'Isa', 'Moses', 'Ismail'];

  const winners = getRandomWinners(names);

  expect(winners.length).toEqual(1);

  const winners2 = getRandomWinners(names, 2);

  expect(winners2.length).toEqual(2);
});

const dataSet = [
  [
    '"anu kae" "super" "sekali kae lo"', [
      'anu kae', 'super', 'sekali kae lo',
    ]],
  [
    '"Indonesia" "Malaysia" Bali', ['Indonesia', 'Malaysia'],
  ],
  [
    'nganu kae', [],
  ],
  [
    'z', [],
  ],
  [
    '', [],
  ],
];
it.each(dataSet)('Extract message using inside quote only', (input, expectedValue) => {
  const extractedStrings = extractMessageByDoubleQuote(input);

  expect(extractedStrings).toEqual(expectedValue);
});

const dataSet2 = [
  [
    '"anu kae" "super" "sekali kae lo"', [
      'anu kae', 'super', 'sekali kae lo',
    ]],
  [
    '"Indonesia" "Malaysia" Bali', ['Indonesia', 'Malaysia', 'Bali'],
  ],
  [
    'nganu kae', ['nganu', 'kae'],
  ],
  [
    'z', ['z'],
    '', [],
  ],
];
it.each(dataSet2)('Extract message and command', (input, expectedValue) => {
  const extractedStrings = extractMessageAndConfig(input);

  expect(extractedStrings).toEqual(expectedValue);
});

const dataSet3 = [
  [
    '"anu kae" "super" "sekali kae lo"', []],
  [
    '"Indonesia" "Malaysia" Bali', ['Bali'],
  ],
  [
    'nganu kae', ['nganu', 'kae'],
  ],
  [
    'z', ['z'],
    '', [],
  ],
];
it.each(dataSet3)('Extract message and command', (input, expectedValue) => {
  const extractedStrings = extractConfig(input, extractMessageByDoubleQuote(input));

  expect(extractedStrings).toEqual(expectedValue);
});
