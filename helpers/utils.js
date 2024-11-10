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
export function extractMessageByDoubleQuote(string) {
  const regex = /"[^"]+"/g;
  const extracted = string.match(regex);
  if (extracted) {
    return extracted.map((s) => s.replace(/"(.+)"/, '$1'));
  }
  return [];
}

/**
 * @param {string} string - text that will be extracted
 * @returns {array} list of extracted text
 */
export function extractMessageAndConfig(string) {
  const regex = /"[^"]+"|[^\s]+/g;
  return string.match(regex).map((s) => s.replace(/"(.+)"/, '$1'));
}

/**
 * Config means anything else beside string inside quote
 * @param {string} argumentText -
 * @param {array} messages - extracted messages
 * @returns {array} extracted command
 */
export function extractConfig(argumentText, messages) {
  const extractedTextCommands = extractMessageAndConfig(argumentText);
  return extractedTextCommands.filter((val) => !messages.includes(val));
}

/**
 * Randomly shuffles an array in place using the Fisher-Yates algorithm.
 *
 * @param {array} array - The array to be shuffled.
 * @returns {array} - The shuffled array.
 */
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


/**
 * helper function to generate random numbers
 *
 * @param {number} start - the start of the range
 * @param {number} end - the end of the range
 * @returns {number[]} - an array of random numbers
 */
export function generateRandomNumbers(start, end) {
  return Array.from({length: end - start + 1}, (_, i) => i + start);
}
