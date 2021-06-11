const User = require("../models/user");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const loginGET = (req, res, next) => {
  // const flashMessage = req.flash("error") || "no error";
  // console.log(req.flash());
  // console.log(flashMessage);
  res.render("auth/login");
};

const loginPOST = async (req, res, next) => {
  const { userName, userPassword } = req.body;
  const user = await User.findOne({ userName });
  let matchingPassword;
  if (user) {
    matchingPassword = await bcrypt.compare(userPassword, user.userPassword);
  }
  if (matchingPassword) {
    req.session.userId = user.id;
    req.session.isAuthenticated = true;
    res.redirect("/shop");
  } else {
    req.flash("error", "No matching password or user name");
    res.redirect("/user/login");
  }
};

const signupGET = (req, res, next) => {
  res.render("auth/signup");
};

const signupPOST = async (req, res, next) => {
  const { userName, userPassword, userMail } = req.body;
  const hashedPassword = await bcrypt.hash(userPassword, 12);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("auth/signup", { validationErrors: errors.array() });
  }

  try {
    const user = await User.findOne({ userName });
    if (user) throw new Error("This user name is not available");
  } catch (err) {
    console.log(err);
    req.flash("error", err.message);
    return res.redirect("/user/signup");
  }

  const newUser = new User({
    userName,
    userPassword: hashedPassword,
    userMail,
    cart: { items: [], totalPrice: 0 },
  });
  try {
    await newUser.save();
  } catch (err) {
    const error = new Error("Something went wrong. Try again later");
    req.flash("error", error.message);
    return res.redirect("/user/signup");
  }

  req.flash("success", "Your account has been created");
  res.redirect("/user/login");
};

const resetPasswordGET = (req, res, next) => {
  res.render("auth/reset");
};

const resetPasswordPOST = async (req, res, next) => {
  const userMail = req.body.userMail;
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      flash("error", err);
      res.redirect("/user/reset");
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
      console.log(err);
    }
    req.flash(
      "success",
      "An e-mail has been sent. Please follow the instructions to generate a new password"
    );
    res.redirect("/user/login");
  });
};
const generateNewPasswordGET = (req, res, next) => {
  const token = req.params.token;
  res.render("auth/generatePassword", { token });
};

const generateNewPasswordPOST = async (req, res, next) => {
  const token = req.params.token;
  const { userPassword } = req.body;

  const user = await User.findOne({ resetToken: token });
  if (!user || Date.now() > user.resetTokenExpiration) {
    req.flash("error", "Your token is not valid!");
    return res.redirect("/user/reset");
  }
  const hashedPassword = await bcrypt.hash(userPassword, 12);
  user.userPassword = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiration = null;

  try {
    user.save();
  } catch (err) {
    console.log(err);
  }
  req.flash("success", "Your password has been reseted. You can log in now");
  res.redirect("/user/login");
};

const logOut = (req, res, next) => {
  req.session.destroy();
  res.redirect("/shop");
};
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
