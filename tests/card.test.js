import {
  buildInputForm,
  buildMessageBody,
  buildNameListSection,
  buildNameListWinnerSection,
} from '../helpers/components.js';

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
  const winnerSection = buildNameListWinnerSection(names, ['Moses']);
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
                'iconUrl': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Solid_white_bordered.png',
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Ismail',
              'startIcon': {
                'iconUrl': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Solid_white_bordered.png',
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Zulkarnain',
              'startIcon': {
                'iconUrl': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Solid_white_bordered.png',
              },
            },
          },
          {
            'decoratedText': {
              'text': 'Sulaiman',
              'startIcon': {
                'iconUrl': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Solid_white_bordered.png',
              },
            },
          },
        ],
      },
    ],
  };
  expect(winnerSection).toStrictEqual(expected);
});

test('buildInputForm test', () => {
  const defaultValues = ['Ismail bin Ibrahim', 'Ishaq bin Ibrahim', 'Isa bin Mariyam'];
  const form = buildInputForm(defaultValues);
  expect(form).toEqual({
    'fixedFooter': {
      'primaryButton': {
        'onClick': {
          'action': {
            'function': 'create_shuffle',
            'parameters': [],
          },
        },
        'text': 'Submit',
      },
    },
    'header': {
      'imageType': 'CIRCLE',
      'imageUrl': '',
      'subtitle': 'If the items are more than 32, the items will be randomly cut to 32',
      'title': 'Maximum item is 32.',
    },
    'sections': [
      {
        'header': 'Names',
        'widgets': [
          {
            'textInput': {
              'label': 'Please input the items',
              'name': 'items',
              'type': 'MULTIPLE_LINE',
              'value': 'Ismail bin Ibrahim\nIshaq bin Ibrahim\nIsa bin Mariyam',
            },
          },
        ],
      },
    ],
  });
});
