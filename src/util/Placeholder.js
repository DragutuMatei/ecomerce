export default class Placeholder {
  static makeimg(img) {
    if (img) return img;
    return require("../img/product-1.jpg");
  }
  static makenumber(num) {
    return num.toLocaleString("en-US");
  }
}
