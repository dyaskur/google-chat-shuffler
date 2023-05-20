import {createMessage, getMembers, getMessage, updateMessage} from '../src/helpers/api';
import {buildMessageBody, buildNameListSection} from '../src/helpers/components.js';
// This file consists of several tests that I utilized to experiment with the Google Chat API.
test.skip('get space memberships', async () => {
  // I move this to here for temporary, because this is skipped but affect the test coverage

  const members = await getMembers('spaces/AAAAqFtzdps');

  expect(members.length).toBeGreaterThan(0);

  // const memberName = members.map(a => a.member.displayName);
  // const memberName = ['1', '2', '3', '4', '5', '6'];
  const memberName = Array.from({length: 32}, (_, i) => (i + 1).toString());

  const cardSection = buildNameListSection(memberName);
  const message = buildMessageBody(cardSection);
  const options = {thread: {name: 'spaces/AAAAqFtzdps/threads/pfyovAULzfo'}};

  const request = {
    parent: 'spaces/AAAAqFtzdps',
    requestBody: message,
    threadKey: options.thread.name,
    messageReplyOption: 'REPLY_MESSAGE_OR_FAIL',
  };
  options.threadKey = options.thread.name;

  const apiResponse = await createMessage(request, options);
  const messageId = apiResponse.data.name;
  const messageResponse = await getMessage(messageId);
  console.log(messageResponse);

  const updateText = {
    text: 'This is updated message',
  };
  const updateRequestBody = {
    name: messageId,
    requestBody: updateText,
    updateMask: 'text',
  };
  const updateResponse = await updateMessage(updateRequestBody);
  console.log(JSON.stringify(updateResponse));

  // expect(apiResponse).toHaveReturned()
}, 500000);
