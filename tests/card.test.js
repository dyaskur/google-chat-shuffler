import {buildMessageBody, buildNameListSection, buildNameListWinnerSection} from '../src/helpers/components.js';

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

test('build name list card with a winner', () => {
  const names = [
    'Moses',
    'Ibrahim',
    'Ismail',
    'Zulkarnain',
    'Sulaiman',
  ];
  const section = buildNameListWinnerSection(names, ['Yaskur']);
  const expected = {
    'sections': [
      {
        'widgets': [
          {
            'decoratedText': {
              'text': '<b>Moses</b>',
              'startIcon': {
                'iconUrl': 'https://raw.githubusercontent.com/dyaskur/google-chat-shuffler/master/assets/1/1.gif',
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Ibrahim',
              'startIcon': {
                'iconUrl': expect.any(String),
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Ismail',
              'startIcon': {
                'iconUrl': expect.any(String),
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Zulkarnain',
              'startIcon': {
                'iconUrl': expect.any(String),
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Sulaiman',
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
});
