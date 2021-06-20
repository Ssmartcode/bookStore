const User = require("../models/user");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// LOGIN
const loginGET = (req, res, next) => {
  res.render("auth/login");
};

const loginPOST = async (req, res, next) => {
  req.path = "/user/login";
  const { userName, userPassword } = req.body;

  // check if the user exists
  let user;
  try {
    user = await User.findOne({ userName });
  } catch (err) {
    const error = new Error("Something went wrong. Please try again later");
    error.code = 422;
    return next(error);
  }

  // error if no user has been found
  if (!user) {
    const error = new Error("We could not find any user");
    error.code = 422;
    return next(error);
  }

  // check if password is matching
  let matchingPassword;
  if (user) {
    matchingPassword = await bcrypt.compare(userPassword, user.userPassword);
  }
  if (matchingPassword) {
    req.session.userId = user.id;
    req.session.isAuthenticated = true;
    res.redirect("/shop");
  } else {
    const error = new Error("No matching password or user name");
    error.code = 404;
    next(error);
  }
};

// SIGNUP
const signupGET = (req, res, next) => {
  res.render("auth/signup");
};

const signupPOST = async (req, res, next) => {
  req.path = "/user/signup";

  const { userName, userPassword, userMail } = req.body;
  const hashedPassword = await bcrypt.hash(userPassword, 12);

  // check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("auth/signup", { validationErrors: errors.array() });
  }

  // check if an user with the userName already exists
  let user;
  try {
    user = await User.findOne({ userName });
  } catch (err) {
    const error = new Error("Something went wrong. Please try again later");
    error.code = 500;
    return next(error);
  }

  // throw error if userName is not available
  if (user) {
    const error = new Error(
      "This user name has already been used. Please try another one"
    );
    error.code = 422;
    return next(error);
  }

  // save the user in the db
  const newUser = new User({
    userName,
    userPassword: hashedPassword,
    userMail,
    cart: { items: [], totalPrice: 0 },
  });
  try {
    await newUser.save();
  } catch (err) {
    const error = new Error("Something went wrong! Please try again");
    error.code = 500;
    return next(error);
  }

  req.flash("success", "Your account has been created");
  res.redirect("/user/login");
};

// RESET PASSWORD
const resetPasswordGET = (req, res, next) => {
  res.render("auth/reset");
};

const resetPasswordPOST = async (req, res, next) => {
  req.path = "/user/reset";
  const userMail = req.body.userMail;
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      const error = new Error("Something went wrong! Please try again");
      error.code = 500;
      return next(error);
    }
    const token = buffer.toString("hex");

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;

    const msg = {
      to: userMail,
      from: "razvan.anca.andrei@gmail.com",
      subject: "Reset Password",
      text: "Requested password change",
      html: `
      <p>You have requested a password change</p>
      <p>Please click on this link to change your password: <a href="http://localhost:3000/user/reset/${token}">RESET</a></p>
      `,
    };

    try {
      await user.save();
      await sgMail.send(msg);
    } catch (err) {
      const error = new Error("Something went wrong! Please try again");
      error.code = 500;
      return next(error);
    }
    req.flash(
      "success",
      "An e-mail has been sent. Please follow the instructions to generate a new password"
    );
    res.redirect("/user/login");
  });
};

// GENERATE NEW PASSOWRD
const generateNewPasswordGET = (req, res, next) => {
  const token = req.params.token;
  res.render("auth/generatePassword", { token });
};

const generateNewPasswordPOST = async (req, res, next) => {
  req.path = "/user/reset";

  const token = req.params.token;
  const { userPassword } = req.body;

  const user = await User.findOne({ resetToken: token });
  if (!user || Date.now() > user.resetTokenExpiration) {
    const error = new Error("Your token is not valid");
    error.code = 422;
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(userPassword, 12);
  user.userPassword = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiration = null;

  try {
    user.save();
  } catch (err) {
    return next(err);
  }
  req.flash("success", "Your password has been reseted. You can log in now");
  res.redirect("/user/login");
};

// LOGOUT
const logOut = (req, res, next) => {
  req.session.destroy();
  res.redirect("/shop");
};

// EXPORTS
module.exports = {
  loginGET,
  loginPOST,
  signupGET,
  signupPOST,
  logOut,
  resetPasswordGET,
  resetPasswordPOST,
  generateNewPasswordGET,
  generateNewPasswordPOST,
};
