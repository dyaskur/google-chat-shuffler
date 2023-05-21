/**
 *
 * @param {string} text - text
 * @param {string} iconUrl - icon url
 * @returns {{decoratedText: {text, startIcon: {iconUrl}}}} - decorated text element
 */
export function buildDecoratorText(text, iconUrl) {
  return {
    'decoratedText': {
      text,
      'startIcon': {
        iconUrl,
      },
    },
  };
}

/**
 * @param {array} names - list of name
 * @returns {{sections: [{widgets: []}]}} - card section
 */
export function buildNameListSection(names) {
  const sections = {
    'sections': [
      {
        'widgets': [],
      }],
  };

  const range = Array.from({length: names.length}, (_, i) => i + 1);
  const random = range.map((value) => ({value, sort: Math.random()})).
      sort((a, b) => a.sort - b.sort).
      map(({value}) => value);
  for (let i = 0; i < names.length; i++) {
    const url = `https://raw.githubusercontent.com/dyaskur/google-chat-shuffler/master/assets/${names.length}/${random[i]}.gif?12`;
    sections.sections[0].widgets.push(buildDecoratorText(names[i], url));
  }
  return sections;
}

/**
 * @param {array} names - list of name
 * @param {array} winners - the name of winner
 * @returns {{sections: [{widgets: []}]}} - card section
 */
export function buildNameListWinnerSection(names, winners) {
  const sections = {
    'sections': [
      {
        'widgets': [],
      }],
  };
  let url;
  for (let i = 0; i < names.length; i++) {
    let name = names[i];
    if (winners.includes(name)) {
      url = 'https://raw.githubusercontent.com/dyaskur/google-chat-shuffler/master/assets/1/1.gif';
      name = `<b>${name}</b>`;
    } else {
      url = 'https://upload.wikimedia.org/wikipedia/commons/3/38/Solid_white_bordered.png';
    }
    sections.sections[0].widgets.push(buildDecoratorText(name, url));
  }
  return sections;
}

/**
 * @param {object} card - card tag that contain section
 * @param {object} text - message text
 * @returns {{text: string, cardsV2: [{cardId: string, card}]}} - message body that will be chat message
 */
export function buildMessageBody(card, text = '') {
  return {
    text,
    'cardsV2': [
      {
        'cardId': 'card-id',
        'card': card,
      },
    ],
  };
}

/**
 * @param {array} defaultValues - defaultValues
 * @returns {object} - shuffle form
 */
export function buildInputForm(defaultValues) {
  return {
    'sections': [
      {
        'header': 'Names',
        'widgets': [
          {
            'textInput': {
              'label': 'Please input the items',
              'type': 'MULTIPLE_LINE',
              'name': 'items',
              'value': defaultValues.join('\n'),
            },
          },
        ],
      },
    ],
    'fixedFooter': {
      'primaryButton': {
        'text': 'Submit',
        'onClick': {
          'action': {
            'function': 'create_shuffle',
            'parameters': [],
          },
        },
      },
    },
    'header': {
      'title': 'Maximum item is 32.',
      'subtitle': 'If the items are more than 32, the items will be randomly cut to 32',
      'imageUrl': '',
      'imageType': 'CIRCLE',
    },
  };
}
