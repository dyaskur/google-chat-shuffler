import {getMembers} from './helpers/api.js';
import {buildActionResponse, buildActionResponseStatus} from './helpers/response.js';
import {
  configCommandHandler,
  createMessageFromNameListHandler,
  helpCommandHandler,
  updateWinnerCardHandler,
} from './handlers.js';
import {extractConfig, extractMessageByDoubleQuote} from './helpers/utils.js';
import {buildInputForm} from './helpers/components.js';
import {getRandomFromGpt} from './helpers/gpt.js';

/**
 * App entry point.
 * @param {object} req - chat event
 * @param {object} res - chat event
 * @returns {void}
 */
export async function app(req, res) {
  const event = req.body;
  if (req.method === 'PATCH' && event) {
    console.log('received from queue', JSON.stringify(event));
    await updateWinnerCardHandler(event);
    res.status(201).send('');
  } else if (!(req.method === 'POST' && event)) {
    console.log('received from unknown source', JSON.stringify(event));
    res.status(400).send('');
  }
  console.log(JSON.stringify(event));
  console.log(event.type,
      event.common?.invokedFunction || event.message?.slashCommand?.commandId || event.message?.argumentText,
      event.user.displayName, event.user.email, event.space.type, event.space.name, event.threadKey);
  event.threadKey = event.threadKey ?? event.message?.thread?.name;
  let reply = {};
  // Dispatch slash and action events
  if (event.type === 'MESSAGE') {
    const message = event.message;
    if (message.slashCommand?.commandId === '1') { // /random command
      const members = await getMembers(event.space.name);
      const memberNames = members.map((a) => a.member.displayName);
      const inputFormCard = buildInputForm(memberNames);
      reply = buildActionResponse('DIALOG', inputFormCard);
    } else if (message.slashCommand?.commandId === '2') { // /random_members command
      const members = await getMembers(event.space.name);
      const memberNames = members.map((a) => a.member.displayName);
      const winnerCount = parseInt(event.message.argumentText) || 1;
      if (winnerCount > memberNames.length) {
        reply = {
          thread: event.message.thread,
          actionResponse: {
            type: 'NEW_MESSAGE',
          },
          text: 'Your space members is not enough',
        };
      } else {
        await createMessageFromNameListHandler(memberNames, event.space.name, event.threadKey, winnerCount);
      }
    } else if (message.slashCommand?.commandId === '3') { // /help command
      reply = helpCommandHandler(event);
    } else if (message.slashCommand?.commandId === '4') { // /config command
      reply = configCommandHandler(event);
    } else if (message.slashCommand?.commandId === '5') { // /random_gpt command
      const answer = await getRandomFromGpt(event.message.argumentText ?? 'whatever');
      reply = {
        thread: event.message.thread,
        actionResponse: {
          type: 'NEW_MESSAGE',
        },
        text: answer,
      };
    } else if (message.text) {
      const argumentText = event.message?.argumentText;
      const extractedText = extractMessageByDoubleQuote(argumentText);
      if (extractedText.length > 1) {
        let winnerCount = 1;
        const configs = extractConfig(argumentText, extractedText);
        configs.forEach((config) => {
          const winnerConfig = parseInt(config);
          // If the argument is a number, we will assume it is a config indicating the number of winners to choose.
          if (winnerConfig && winnerConfig < extractedText.length) {
            winnerCount = winnerConfig;
          }
        });
        await createMessageFromNameListHandler(extractedText, event.space.name, event.threadKey, winnerCount);
      } else {
        const answer = await getRandomFromGpt(argumentText ?? 'whatever');
        reply = {
          thread: event.message.thread,
          actionResponse: {
            type: 'NEW_MESSAGE',
          },
          text: answer,
        };
      }
    }
  } else if (event.type === 'CARD_CLICKED') {
    const action = event.common?.invokedFunction;
    if (action === 'create_shuffle') {
      const formValues = event.common?.formInputs;
      const items = formValues?.['items']?.stringInputs.value[0]?.trim();
      await createMessageFromNameListHandler(items.split('\n'), event.space.name, event.threadKey);
      reply = buildActionResponseStatus('Your items/names are being shuffle');
    }
  } else if (event.type === 'ADDED_TO_SPACE') {
    const message = `Hi ${event.user.displayName ?? 'there'}, Thanks for installing our app
  Here are the list of available commands:
  */random* Opens a dialog where you can input the items/names to be shuffled. By default, it is pre-filled with the list of members in the current space.
  */random_members* Quickly shuffle all members of the current space.
  */random_gpt* Effortlessly generate quick and random content with the power of GPT commands.
  */config* Displays the current configuration dialog.
  */help* Show more detailed instruction how to use this app
  
  You can also shuffle by mentioning this app, use */help* command for more info
  `;

    reply = {
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
      text: message,
    };
  }
  res.json(reply);
}


