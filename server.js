const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const flash = require("connect-flash");

require("dotenv").config();

const app = express();

mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () =>
  console.log("Successfuly conncected to the data base")
);
connection.on("error", () =>
  console.log("Something went wrong while trying to connect to the data base")
);

app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });
app.use(
  session({
    secret: "REally secret secret thats so secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(require("./middleware/flashMessage"));
app.use(csrfProtection);

app.use((req, res, next) => {
  if (req.session.userId) req.userId = req.session.userId.toString();
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/user", require("./routes/user"));
app.use("/seller", require("./routes/seller"));
app.use("/shop", require("./routes/shop").router);

app.get("/", (req, res, next) => {
  res.render("index");
});

app.use((req, res, next) => {
  res.status(404).render("404page");
});
app.listen("3000");
