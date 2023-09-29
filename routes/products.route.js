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

const schema = {
       title: Joi.string().required(),
       description: Joi.string().allow(""),
       price: Joi.number().required().min(1),
       categoryId: Joi.number().required().min(1),
       id: Joi.number().required(),
       location: Joi.object({
              latitude: Joi.number().required(),
              longitude: Joi.number().required(),
       }).optional(),
};
const ProductsController = require('../controllers/products.controller');




let productsController = new ProductsController();

const validateCategoryId = (req, res, next) => {
       if (!categoriesStore.getCategory(parseInt(req.body.categoryId)))
              return res.status(400).send({ error: "Invalid categoryId." });

       next();
};

router.get("/get-all-Products", async (req, res, next) => {
       const listings = productsController.getAllProducts(req, res, next);
       console.log(listings)
       // const resources = listings.map(listingMapper);
       //res.send(resources);
});

router.post(
       "/",
       [
              // Order of these middleware matters.
              // "upload" should come before other "validate" because we have to handle
              // multi-part form data. Once the upload middleware from multer applied,
              // request.body will be populated and we can validate it. This means
              // if the request is invalid, we'll end up with one or more image files
              // stored in the uploads folder. We'll need to clean up this folder
              // using a separate process.
              auth,
              limitLicensing,
              upload.array("images", config.get("maxImageCount")),
              validateWith(schema),
              validateCategoryId,
              imageResize,
       ],

       async (req, res, next) => {
              const listing = {
                     product: {
                            name: req.body.title,
                            price: parseFloat(req.body.price),
                            categoryId: parseInt(req.body.categoryId),
                            description: req.body.description,
                            id: parseInt(req.body.id),
                            userId: req.user.id,
                            postDate: new Date(),
                            productId: req.body.id == 0 ? 0 : parseInt(req.body.id)
                     }
              }

              listing.images = req.images.map((fileName) => ({ fileName: fileName }));
              req.body = listing;
              
              if (listing.product.productId == 0)
                     await productsController.addProduct(req, res, next);
              else
                     await productsController.editProduct(req, res, next);

              /*
              listing.images = req.images.map((fileName) => ({ fileName: fileName }));
              if (req.body.location) listing.location = JSON.parse(req.body.location);
              if (req.user) listing.userId = req.user.userId;

              store.addListing(listing);

              res.status(201).send(listing);*/
              // res.status(401).send();
       }
);

router.post("/delete-Product", auth, async (req, res, next) => {
       console.log("POST /delete-Product");
       productsController.deleteProduct(req, res, next);

});



module.exports = router;