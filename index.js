import {createMessage, getMembers} from './src/helpers/api.js';

import {buildActionResponse, buildActionResponseStatus} from './src/helpers/response.js';
import {createMessageFromNameListHandler, updateWinnerCardHandler} from './handlers.js';
import {extractMessage} from './src/helpers/utils.js';
import {buildInputForm} from './src/helpers/components.js';

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
    if (message.slashCommand?.commandId === '1') {
      const members = await getMembers(event.space.name);
      const memberNames = members.map((a) => a.member.displayName);
      const inputFormCard = buildInputForm(memberNames);
      reply = buildActionResponse('DIALOG', inputFormCard);
    } else if (message.slashCommand?.commandId === '2') {
      const members = await getMembers(event.space.name);
      const memberNames = members.map((a) => a.member.displayName);
      await createMessageFromNameListHandler(memberNames, event.space.name, event.threadKey);
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
    const message = {};
    message.text = 'Hi there! You can shuffle your team mate using this app';

    const request = {
      parent: event.space.name,
      requestBody: message,
    };
    const apiResponse = await createMessage(request);
    if (apiResponse) {
      reply = buildActionResponseStatus('Thanks for installing our app', 'OK');
    } else {
      reply = buildActionResponseStatus('Failed to send welcome.', 'UNKNOWN');
    }
  }
  res.json(reply);
}


