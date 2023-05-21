import {buildMessageBody, buildNameListSection, buildNameListWinnerSection} from './helpers/components.js';
import {createMessage, updateMessage} from './helpers/api.js';
import {getRandomWinners} from './helpers/utils.js';
import {delayUpdateMessage} from './helpers/task.js';
import {buildActionResponse} from './helpers/response.js';

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

/**
 * @param {object} event - request body
 * @returns {{actionResponse: {type: string}, text: string}} - new message action response
 */
export function helpCommandHandler(event) {
  const message = `Hi ${event.user.displayName}
  Here are the list of available commands:
  */shuffle* Opens a dialog where you can input the items/names to be shuffled. By default, it is pre-filled with the list of members in the current space.
  */shuffle_members* Quickly shuffle all members of the current space.
  */config* Displays the current configuration dialog.
  
  You can also shuffle by mentioning this app, for example: *@Shuffle Maven "Zubair Manta" "Hasan Star" "Kawasaki Honda"* 
  `;
  return {
    thread: event.message.thread,
    actionResponse: {
      type: 'NEW_MESSAGE',
    },
    text: message,
  };
}

/**
 *
 * @param {object} event - request body
 * @returns {{actionResponse: {type: string}}|{actionResponse: {type: string}}} - dialog action response
 */
export function configCommandHandler(event) {
  const message = {
    'sections': [
      {
        'widgets': [
          {
            'textParagraph': {
              'text': 'Here are the current settings of your space. Please note that you cannot update these settings directly. If you need to make changes, please contact us at support@yaskur.com for assistance.',
            },
          },
          {
            'textInput': {
              'label': 'Shuffle delay (in seconds)',
              'type': 'SINGLE_LINE',
              'name': 'fieldName',
              'hintText': 'The delay before the items/names shuffled',
              'value': '10',
            },
          },
          {
            'textInput': {
              'label': 'Default shuffle count',
              'type': 'SINGLE_LINE',
              'name': 'shuffle_count',
              'hintText': '',
              'value': '1',
            },
          },
        ],
      },
    ],
  };
  return buildActionResponse('DIALOG', message);
}
