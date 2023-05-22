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
