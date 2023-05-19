/**
 * App entry point.
 * @param {object} req - chat event
 * @param {object} res - chat event
 * @returns {void}
 */
import {getMembers, createMessage} from "./src/helpers/api.js";

import {buildActionResponse} from "./src/helpers/response.js";
import {buildMessageBody, buildNameListSection} from "./src/helpers/components.js";

export async function app(req, res) {
  if (!(req.method === 'POST' && req.body)) {
    res.status(400).send('');
  }
  const event = req.body;
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
      const members = await getMembers(event.space.name)
      const cardSection = buildNameListSection(members.map(a => a.member.displayName))
      const message = buildMessageBody(cardSection)

      reply = {
        actionResponse: {
          type: 'NEW_MESSAGE',
        },
        ...message
      };

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
      reply = buildActionResponse('Thanks for installing our app', 'OK');
    } else {
      reply = buildActionResponse('Failed to send welcome.', 'UNKNOWN');
    }
  }
  res.json(reply);
};



