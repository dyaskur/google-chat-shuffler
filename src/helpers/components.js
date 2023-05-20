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

  for (let i = 0; i < names.length; i++) {
    const url = `https://raw.githubusercontent.com/0fat/titip_asset/main/${names.length}/${i + 1}.gif`;
    sections.sections[0].widgets.push(buildDecoratorText(names[i], url));
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
