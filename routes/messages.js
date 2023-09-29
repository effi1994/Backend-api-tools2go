const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Expo } = require("expo-server-sdk");

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const messagesStore = require("../store/messages");
const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const UserService = require('../services/users.service');
const ProductsService = require('../services/products.service');

const MessagesController = require('../controllers/messages.controller');


const schema = {
  productId: Joi.number().required(),
  message: Joi.string().required(),
};

const schema2 = {
  message: Joi.string().required()
};


router.get("/my-messages", auth, async (req, res, next) => {
  req.body.userId = req.user.id;
  console.log(req.body.userId);
  let messagesController = new MessagesController();
  await messagesController.getUsersSendAndGetMessages(req, res, next);
});

router.post("/get-user-chats", auth, async (req, res, next) => {
  req.body.userId = req.user.id;
  console.log(req.body);
  req.body.userId2 = req.body.userId2;
  let messagesController = new MessagesController();
  await messagesController.getMessagesForUser(req, res, next);
});


router.post("/add-message-product", [auth, validateWith(schema)], async (req, res, next) => {
  req.body.fromUserId = req.user.id;
  console.log(req.body);
  let messagesController = new MessagesController();
  await messagesController.addMessageProduct(req, res, next);
});

router.post("/add-message-user", [auth], async (req, res, next) => {
  req.body.fromUserId = req.user.id;
  
  console.log(req.body);
  let messagesController = new MessagesController();
  await messagesController.addMessageToUser(req, res, next);
});


router.post("/delete-message", auth, async (req, res, next) => {
  let messagesController = new MessagesController();
  await messagesController.deleteMessage(req, res, next);
});


  
  module.exports = router;
