export default class Placeholder {
  static makeimg(img) {
    if (img) return img;
    return require("../img/product-1.jpg");
  }
  static makenumber(num) {
    return num.toLocaleString("en-US");
  }
  static getdate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "/" + mm + "/" + yyyy;
    return formattedToday;
  }

  static roundit(num) {
    return Math.round(num * 100) / 100;
  }
}
