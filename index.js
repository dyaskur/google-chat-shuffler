import {createMessage, getMembers} from './src/helpers/api.js';

import {buildActionResponseStatus} from './src/helpers/response.js';
import {buildMessageBody, buildNameListSection} from './src/helpers/components.js';
import {delayUpdateMessage} from './src/helpers/task.js';
import {updateWinnerCardHandler} from './handlers.js';

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
      // reply = showShuffleForm(event);
      // todo: handle suffle form dialog
    } else if (message.slashCommand?.commandId === '2') {
      const members = await getMembers(event.space.name);
      const memberNames = members.map((a) => a.member.displayName);
      const cardSection = buildNameListSection(memberNames);
      const message = buildMessageBody(cardSection);

      const request = {
        parent: event.space.name,
        threadKey: event.threadKey ?? event.message.thread.name,
        requestBody: message,
        messageReplyOption: 'REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD',
      };
      const apiResponse = await createMessage(request, {
        thread: {name: event.message.thread.name},
        threadKey: event.threadKey ?? event.message.thread.name,
      });

      const messageId = apiResponse.data.name;
      const payload = {
        messageId,
        names: memberNames,
      };
      await delayUpdateMessage(JSON.stringify(payload));
    } else if (message.text) {
      // todo: handle mentioned message
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


