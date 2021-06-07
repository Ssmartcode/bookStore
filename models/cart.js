const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [{ type: Object }],
  totalPrice: { type: Number },
});

module.exports = mongoose.model("Cart", cartSchema);
// const Product = require("./product");
// const path = require("path");
// const fs = require("fs");

// const filePath = path.join(__dirname, "..", "storage", "cart.json");

// const getFileContent = (cb) => {
//   let cart = [];
//   fs.readFile(filePath, (err, fileContent) => {
//     if (!err) {
//       cart = JSON.parse(fileContent);
//       return cb(cart);
//     }
//     return cb([]);
//   });
// };

// class Cart {
//   static getCart(cb) {
//     getFileContent((cart) => {
//       return cb(cart);
//     });
//   }
//   static addToCart(productId, productPrice) {
//     getFileContent((cart) => {
//       let updatedCart = { products: [], totalPrice: 0 };
//       if (Object.keys(cart).length !== 0) updatedCart = { ...cart };

//       const productIndex = updatedCart.products.findIndex(
//         (product) => product.id === productId
//       );
//       if (productIndex > -1) {
//         const newProduct = updatedCart.products[productIndex];
//         newProduct.qty += 1;
//       } else {
//         updatedCart.products.push({ id: productId, qty: 1 });
//       }
//       updatedCart.totalPrice += +productPrice;
//       fs.writeFile(
//         filePath,
//         JSON.stringify(updatedCart),
//         (err) => err && console.log(err)
//       );
//     });
//   }
//   static deleteFromCart(id, productPrice) {
//     getFileContent((cart) => {
//       const updatedCart = { ...cart };
//       const product = updatedCart.products.find((prod) => prod.id === id);
//       const productQty = product.qty;
//       updatedCart.totalPrice -= productPrice * productQty;
//       updatedCart.products.filter((product) => product === product.id);
//     });
//   }
// }
// module.exports = Cart;
