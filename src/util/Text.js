export default class Text {
  static returnSizedText(text) {
    if (text.length > 25) return text.slice(0, 25) + "...";
    return text;
  }
}
