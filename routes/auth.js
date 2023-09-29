const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");
const AuthController = require('../controllers/auth.controller');
const c = require("config");
const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};

let authController = new AuthController();

router.post("/signup", (req, res,next) => {
  console.log("signup");
  authController.signUp(req, res,next);
});

router.post("/login", validateWith(schema), (req, res,next) => {
  console.log("login");
  authController.logIn(req, res,next);
 
});

router.post("/setExpoToken", (req, res,next) => {
  authController.setExpoToken(req, res,next);
});

router.post("/changePassword", (req, res,next) => {
  authController.changePassword(req, res,next);
} );

router.post("/restPassword", (req, res,next) => {
  console.log("resetPassword");
  authController.resetPassword(req, res,next);
} );

router.post("/verifyEmail",  (req, res,next) => {
  authController.verifyEmail(req, res,next);
});

router.post("/verification",  (req, res,next) => {
  authController.verification(req,res,next);
});
  







module.exports = router;
