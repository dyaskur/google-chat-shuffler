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
                'iconUrl': 'https://raw.githubusercontent.com/0fat/titip_asset/main/2.gif',
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Nganu',
              'startIcon': {
                'iconUrl': 'https://raw.githubusercontent.com/0fat/titip_asset/main/3.gif',
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Dyas',
              'startIcon': {
                'iconUrl': 'https://raw.githubusercontent.com/0fat/titip_asset/main/4.gif',
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Muhammad',
              'startIcon': {
                'iconUrl': 'https://raw.githubusercontent.com/0fat/titip_asset/main/5.gif',
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
