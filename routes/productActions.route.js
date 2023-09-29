const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Expo } = require("expo-server-sdk");
const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const ProductActionsController = require('../controllers/productActions.controller');


router.post("/check-is-available-product", auth, async (req, res, next) => {
       req.body.userId = req.user.id;
       console.log(req.body);
       let productActionsController = new ProductActionsController();
       await productActionsController.checkProductAvailability(req, res, next);
});

router.post("/rent-product", auth, async (req, res, next) => {
       req.body.userId = req.user.id;
       let productActionsController = new ProductActionsController();
       await productActionsController.payRent(req, res, next);


});

router.get("/my-rent", auth, async (req, res, next) => {
       req.body.userId = req.user.id;
       let productActionsController = new ProductActionsController();
       await productActionsController.getMyProductsRenting(req, res, next);
});






module.exports = router;

