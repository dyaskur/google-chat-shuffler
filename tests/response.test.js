import {buildActionResponse, buildActionResponseStatus} from '../src/helpers/response.js';

test('response action status ', () => {
  const actionResponse = buildActionResponseStatus('hello');
  const expectedMessage = {
    'actionResponse': {
      'dialogAction': {
        'actionStatus': {
          'statusCode': 'OK',
          'userFacingMessage': 'hello',
        },
      },
      'type': 'DIALOG',
    },
  };
  expect(actionResponse).toStrictEqual(expectedMessage);

  const actionResponse2 = buildActionResponseStatus('Your input is invalid', 'INVALID_ARGUMENT');
  const expectedMessage2 = {
    'actionResponse': {
      'dialogAction': {
        'actionStatus': {
          'statusCode': 'INVALID_ARGUMENT',
          'userFacingMessage': 'Your input is invalid',
        },
      },
      'type': 'DIALOG',
    },
  };
  expect(actionResponse2).toStrictEqual(expectedMessage2);
});

test('test action dialog', () => {
  const message = {'text': ''};
  const actionResponse = buildActionResponse('NEW_MESSAGE', message);
  const expectedMessage = {
    'actionResponse': {
      'type': 'NEW_MESSAGE',
    },
    'text': '',
  };
  expect(actionResponse).toStrictEqual(expectedMessage);

  const actionResponse2 = buildActionResponse('DIALOG', message);
  const expectedMessage2 = {
    'actionResponse': {
      'type': 'DIALOG',
    },
    'dialogAction': {
      dialog: {
        body: message.cardsV2,
      },
    },
  };
  expect(actionResponse2).toStrictEqual(expectedMessage2);
});
