import {getMembers} from './helpers/api.js';
import {buildActionResponse, buildActionResponseStatus} from './helpers/response.js';
import {
  configCommandHandler,
  createMessageFromNameListHandler,
  helpCommandHandler,
  updateWinnerCardHandler,
} from './handlers.js';
import {extractMessage} from './helpers/utils.js';
import {buildInputForm} from './helpers/components.js';

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
      event.user.displayName, event.user.email, event.space.type, event.space.name);
  let reply = {};
  // Dispatch slash and action events
  if (event.type === 'MESSAGE') {
    const message = event.message;
    if (message.slashCommand?.commandId === '1') { // /shuffle command
      const members = await getMembers(event.space.name);
      const memberNames = members.map((a) => a.member.displayName);
      const inputFormCard = buildInputForm(memberNames);
      reply = buildActionResponse('DIALOG', inputFormCard);
    } else if (message.slashCommand?.commandId === '2') { // /shuffle_members command
      const members = await getMembers(event.space.name);
      const memberNames = members.map((a) => a.member.displayName);
      await createMessageFromNameListHandler(memberNames, event.space.name, event.threadKey);
    } else if (message.slashCommand?.commandId === '3') { // /help command
      reply = helpCommandHandler(event);
    } else if (message.slashCommand?.commandId === '4') { // /config command
      reply = configCommandHandler(event);
    } else if (message.text) {
      const argumentText = event.message?.argumentText;
      const extractedText = extractMessage(argumentText);
      if (extractedText.length > 1) {
        await createMessageFromNameListHandler(extractedText, event.space.name, event.threadKey);
      } else {
        reply = {
          thread: event.message.thread,
          actionResponse: {
            type: 'NEW_MESSAGE',
          },
          text: 'Sorry you need at least 2 items to do shuffle. Try *@Shuffle Maven "Alexandro Manta" "Hasan Monero"*. ' +
              'Or you can also use */shuffle_members* command to quick shuffle all member of this space',
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
    const message = 'Hi there! You can shuffle your team mate using this app';

    reply = {
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
      text: message,
    };
  }
  res.json(reply);
}


