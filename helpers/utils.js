/**
 * @param {array} names - list of names
 * @param {integer} winnerCount - total winner that picked from names
 * @returns {array} - list of winner
 */
export function getRandomWinners(names, winnerCount = 1) {
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }
  return names.slice(0, winnerCount);
}

/**
 * @param {string} string - text that will be extracted
 * @returns {array} list of extracted text
 */
export function extractMessage(string) {
  const regex = /"[^"]+"/g;
  const extracted = string.match(regex);
  if (extracted) {
    return extracted.map((s) => s.replace(/"(.+)"/, '$1'));
  }
  return [];
}
