import {buildMessageBody, buildNameListWinnerSection} from './src/helpers/components.js';
import {updateMessage} from './src/helpers/api.js';
import {getRandomWinners} from './src/helpers/utils.js';

/**
 * @param {object} requestBody - list of names
 * @returns {Promise<void>} update message
 */
export async function updateWinnerCardHandler(requestBody) {
  const names = requestBody.names;
  const winner = getRandomWinners(names);
  const messageText = `Congratulations! We have shuffled the list of names and the winner is *${winner.join(',')}*.`;
  const message = buildMessageBody(buildNameListWinnerSection(names, winner), messageText);
  const request = {
    name: requestBody.messageId,
    requestBody: message,
    updateMask: 'text,cardsV2',
  };
  await updateMessage(request);
}

