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
  const winnerCount = requestBody.count ?? 1;
  const winner = getRandomWinners(names, winnerCount);
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
 * @param {integer} count - winner count
 * @returns {Promise<void>} will post the message to google API
 */
export async function createMessageFromNameListHandler(names, space, thread = null, count = 1) {
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
    count,
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
  */random* Opens a dialog where you can input the items/names to be shuffled. By default, it is pre-filled with the list of members in the current space.
  */random_members {count}* Quickly get a member of the current space. It's using a simple animation during randomizing
  */random_gpt {your_prompt}* Get quick random staff using GPT command 
  example 1: */random_gpt number from 1 to 100* it will return a number between 1 to 100 (e.g 12)
  example 2: */random_gpt place to visit in Egypt* it will return a random place in Egypt
  example 3: */random_gpt joke about programmer* it will return a joke related to programmer
  example 4: */random_gpt quote for broken heart* it will return a quote to motivate the broken heart person
  */config* Displays the current configuration dialog.
  
  Discover the power of randomization by mentioning this app. By enclosing your request within double quotes, you can retrieve a random staff from the chat message. Alternatively, without double quotes, the app will utilize your message as a GPT command to generate a staff for you.
  example 1(with double quote): *@Randombot "Zubair Manta" "Hasan Star" "Kawasaki Honda"* will shuffle the list given
  example 2(without double quote): *@Randombot number between 10 and 20* just like */random_gpt* command, it will return a number between 10 and 20
  example 3: *@Randombot number between 10 and 20* just like */random_gpt* command, it will return a number between 10 and 20
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
