const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, require: true },
  price: { type: String, require: true },
});

module.exports = mongoose.model("Product", productSchema);

// const path = require("path");
// const fs = require("fs");
// const { v4 } = require("uuid");
// const Cart = require("./cart");

// const filePath = path.join(__dirname, "..", "storage", "products.json");

// const getFileContent = (cb) => {
//   let products = [];
//   fs.readFile(filePath, (err, fileContent) => {
//     if (!err) {
//       products = JSON.parse(fileContent);
//       return cb(products);
//     }
//     cb([]);
//   });
// };
// class Prouduct {
//   constructor(title, price) {
//     this.title = title;
//     this.price = price;
//   }

//   save() {
//     this.id = v4();
//     getFileContent((products) => {
//       products.push(this);
//       fs.writeFile(filePath, JSON.stringify(products), (err) => {
//         err && console.log(err);
//       });
//     });
//   }

//   static getAll(cb) {
//     getFileContent(cb);
//   }

//   static findById(id, cb) {
//     getFileContent((products) => {
//       const product = products.find((product) => product.id === id);
//       cb(product);
//     });
//   }
//   static findByIdAndUpdate(id, object) {
//     getFileContent((products) => {
//       const productIndex = products.findIndex(
//         (oldProduct) => oldProduct.id === id
//       );
//       const product = products.find((product) => product.id === id);
//       const updatedProduct = { ...product, ...object };
//       products[productIndex] = updatedProduct;
//       fs.writeFile(
//         filePath,
//         JSON.stringify(products),
//         (err) => err && console.log(err)
//       );
//     });
//   }
//   static findByIdAndDelete(id) {
//     getFileContent((products) => {
//       const updatedProducts = products.filter((product) => product.id !== id);
//       const product = products.find((product) => product.id === id);
//       fs.writeFile(
//         filePath,
//         JSON.stringify(updatedProducts),
//         (err) => !err && Cart.deleteFromCart(id, product.price)
//       );
//     });
//   }
// }

// module.exports = Prouduct;
