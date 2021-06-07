const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const User = require("./models/user");

mongoose
  .connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          userName: "deico",
          userPassword: "a",
          cart: { items: [], totalPrice: 0 },
        });
        newUser.save(() => console.log("User created"));
      }
    });
  });
const connection = mongoose.connection;

connection.once("open", () =>
  console.log("Successfuly conncected to the data base")
);
connection.on("error", () =>
  console.log("Something went wrong while trying to connect to the data base")
);

app.use((req, res, next) => {
  User.findOne().then((user) => {
    req.user = user;
    next();
  });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", require("./routes/admin"));
app.use("/shop", require("./routes/shop").router);

app.get("/", (req, res, next) => {
  res.render("index");
});

app.use((req, res, next) => {
  res.status(404).render("404page");
});
app.listen("3000");
