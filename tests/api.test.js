import {createMessage, getMembers} from "../src/helpers/api";
import {buildMessageBody, buildNameListSection} from "../src/helpers/components.js";

test('get space memberships', async () => {
  const members = await getMembers('spaces/AAAAqFtzdps');

  expect(members.length).toBeGreaterThan(0);

  const message = buildMessageBody(buildNameListSection(members.map(a => a.member.displayName)))
  const options = {thread: {name: 'spaces/AAAAqFtzdps/threads/pfyovAULzfo'}}

  const request = {
    parent: 'spaces/AAAAqFtzdps',
    requestBody: message,
    threadKey: options.thread.name,
    messageReplyOption: 'REPLY_MESSAGE_OR_FAIL'
  };
  options.threadKey = options.thread.name;


  const apiResponse = await createMessage(request, options);
  expect(apiResponse).toHaveReturned()
}, 500000);
