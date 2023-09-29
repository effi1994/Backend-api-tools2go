const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");

const store = require("../store/listings");
const categoriesStore = require("../store/categories");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const delay = require("../middleware/delay");
const listingMapper = require("../mappers/listings");
const config = require("config");
const CreditCardController = require('../controllers/creditCard.controller');






router.get("/get-creditCard",auth, async (req, res, next) => {
       req.body.userId = req.user.id;
       let creditCardController = new CreditCardController();
       console.log(req.body.userId);

       const creditCard = await creditCardController.getCreditCardByUserId(req, res, next);
       
});

router.post("/add-creditCard",auth, async (req, res, next) => {
       req.body.newCreditCard.userId = req.user.id;
    
       let creditCardController = new CreditCardController();

       const creditCard = await creditCardController.createCreditCard(req, res, next);
       
});

router.post("/delete-creditCard",auth, async (req, res, next) => {
       req.body.userId = req.user.id;
       console.log(req.body.userId);

       let creditCardController = new CreditCardController();
       const creditCard = await creditCardController.deleteCreditCardById(req, res, next);
       
});


module.exports = router;



