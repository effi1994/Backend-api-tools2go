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
const RatingController = require('../controllers/rating.controller');

const schema = {
  listingId: Joi.number().required(),
  message: Joi.string().required(),
};



router.get("/get-product-ratings", (req, res) => {
  // Implement your logic to get product ratings
  // Example: const productRatings = ratingsStore.getProductRatings(req.user.userId);
  console.log('add-message1');
  res.send('add-message')  // Return the product ratings
 // res.send(productRatings);
});

router.post("/add-rating",  (req, res) => {
  // Implement your logic to add a rating
  console.log('add-message2');
  res.send('add-message')
  // Example: ratingsStore.addRating(req.user.userId, productId, rating);
  res.status(201).send();
});

router.put("/edit-rating", (req, res) => {
  // Implement your logic to edit a rating
  console.log('add-message3');
  res.send('add-message')  // Example: ratingsStore.editRating(ratingId, newRating);
  res.status(200).send();
});

router.delete("/delete-rating",  (req, res) => {
  // Implement your logic to delete a rating
  console.log('add-message3');
 res.send('add-message3')
  // Example: ratingsStore.deleteRating(ratingId);
  res.status(200).send();
});

module.exports = router;
