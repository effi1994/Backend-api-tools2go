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
const limitLicensing = require("../middleware/limitLicensing.middleware");

const upload = multer({
       dest: "uploads/",
       limits: { fieldSize: 25 * 1024 * 1024 },
});

const ProductActionsController = require('../controllers/productActions.controller');

router.post("/", [
       auth,
       upload.array("images", config.get("maxImageCount")),
       imageResize
], async (req, res, next) => {
       req.body.userId = req.user.id;
       const imageGetProduct = {
              productId:parseInt(req.body.productId) ,
              userId: req.user.id,
              actionId: parseInt(req.body.actionId),
              isBefore: req.body.isBefore ? true: false,
              id:parseInt (req.body.id),
              fileName: req.images.map((fileName) => ({ fileName: fileName }))[0].fileName
       }


       req.body = imageGetProduct;
       let productActionsController = new ProductActionsController();
       await productActionsController.addImageGetProduct(req, res, next);


});

module.exports = router;