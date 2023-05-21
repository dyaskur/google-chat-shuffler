import {buildMessageBody, buildNameListSection, buildNameListWinnerSection} from './src/helpers/components.js';
import {createMessage, updateMessage} from './src/helpers/api.js';
import {getRandomWinners} from './src/helpers/utils.js';
import {delayUpdateMessage} from './src/helpers/task.js';

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

/**
 * @param {array} names - list of name that will be shuffled
 * @param {string} space - google chat space name
 * @param {string} thread - chat thread/parent
 * @returns {Promise<void>} will post the message to google API
 */
export async function createMessageFromNameListHandler(names, space, thread = null) {
  const cardSection = buildNameListSection(names);
  const message = buildMessageBody(cardSection);

  const request = {
    parent: space,
    threadKey: thread,
    requestBody: message,
    messageReplyOption: 'REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD',
  };
  const apiResponse = await createMessage(request);

  const messageId = apiResponse.data.name;
  const payload = {
    messageId,
    names: names,
  };
  await delayUpdateMessage(JSON.stringify(payload));
}
