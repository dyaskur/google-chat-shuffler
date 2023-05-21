import {getRandomWinners} from '../src/helpers/utils.js';

test('get the winner', () => {
  const names = ['Ibrahim', 'Isa', 'Moses', 'Ismail'];

  const winners = getRandomWinners(names);

  expect(winners.length).toEqual(1);

  const winners2 = getRandomWinners(names, 2);

  expect(winners2.length).toEqual(2);
});
