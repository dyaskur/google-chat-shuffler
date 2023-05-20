import {buildMessageBody, buildNameListSection} from '../src/helpers/components.js';

test('build name list card', () => {
  const names = [
    'Yaskur',
    'Nganu',
    'Dyas',
    'Muhammad',
  ];
  const section = buildNameListSection(names);
  const expected = {
    'sections': [
      {
        'widgets': [
          {
            'decoratedText': {
              'text': 'Yaskur',
              'startIcon': {
                'iconUrl': expect.any(String),
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Nganu',
              'startIcon': {
                'iconUrl': expect.any(String),
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Dyas',
              'startIcon': {
                'iconUrl': expect.any(String),
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Muhammad',
              'startIcon': {
                'iconUrl': expect.any(String),
              },
            },
          },
        ],
      },
    ],
  };
  expect(section).toStrictEqual(expected);
  const messageBody = buildMessageBody(section);
  const expectedMessage = {
    'text': '',
    'cardsV2': [
      {
        'cardId': 'card-id',
        'card': section,
      },
    ],
  };
  expect(messageBody).toStrictEqual(expectedMessage);
});
