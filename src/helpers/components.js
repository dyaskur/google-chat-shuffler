export function buildDecoratorText(text, iconUrl) {
  return {
    "decoratedText": {
      text,
      "startIcon": {
        iconUrl
      }
    }
  }
}

export function buildNameListSection(names) {
  const sections = {
    "sections": [
      {
        "widgets": []
      }]
  }
  for (let i = 0; i < names.length; i++
  ) {
    const url = `https://raw.githubusercontent.com/0fat/titip_asset/main/${i + 2}.gif`;
    sections.sections[0].widgets.push(buildDecoratorText(names[i], url))
  }
  return sections;
}

export function buildMessageBody(card, text = "") {
  return {
    text,
    'cardsV2': [
      {
        'cardId': 'card-id',
        'card': card,
      },
    ],
  }
}
