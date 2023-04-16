export default class Text {
  static returnSizedText(text) {
    if (text.length > 20) return text.slice(0, 20) + "...";
    return text;
  }
}
