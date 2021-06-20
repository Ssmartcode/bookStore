const express = require("express");

const router = express.Router();
const { body, check } = require("express-validator");
const User = require("../models/user");
const signupValidation = [
  body("userName")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Your user name shouldn't be left empty"),
  body("userMail")
    .isEmail()
    .withMessage("Your e-mail shouldn't be left empty")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ userMail: value });
      if (user) {
        return Promise.reject("Please choose another e-mail address");
      }
    }),
  body("userPassword", "Your password is tooo short")
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 1 }),
];
const {
  loginGET,
  loginPOST,
  signupGET,
  signupPOST,
  logOut,
  resetPasswordGET,
  resetPasswordPOST,
  generateNewPasswordGET,
  generateNewPasswordPOST,
} = require("../controllers/user");

router.get("/login", loginGET);

router.post("/login", loginPOST);

router.get("/signup", signupGET);

router.post("/signup", signupValidation, signupPOST);

router.get("/reset", resetPasswordGET);

router.post("/reset", resetPasswordPOST);

router.get("/reset/:token", generateNewPasswordGET);

router.post("/reset/:token", generateNewPasswordPOST);

router.post("/logout", logOut);

module.exports = router;
