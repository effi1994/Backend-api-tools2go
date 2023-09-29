const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require('@prisma/client')
const outputFolder = "public/assets";
const productImage = new PrismaClient().productImages;
const ProductsService = require('../services/products.service');

module.exports = async (req, res, next) => {
  const images = [];
  console.log(req.files);

  const resizePromises = req.files.map(async (file) => {
    console.log(file);
    if (parseInt(req.body.id) != 0) {
      let fileNames = [];
      fileNames = await productImage.findMany({
        where: {
          productId: parseInt(req.body.id)
        },
      });
      let fileNamesArr = fileNames.map((fileName) => fileName.fileName);
      let productsService = new ProductsService();
      await productsService.deleteImgs(fileNamesArr); 
     


      await productImage.deleteMany({
        where: {
          productId: parseInt(req.body.id)
        },
      });
      console.log(fileNamesArr);
    }


    await sharp(file.path)
      .resize(2000)
      .jpeg({ quality: 50 })
      .toFile(path.resolve(outputFolder, file.filename + "_full.jpg"));

    await sharp(file.path)
      .resize(100)
      .jpeg({ quality: 30 })
      .toFile(path.resolve(outputFolder, file.filename + "_thumb.jpg"));

    fs.unlinkSync(file.path);

    images.push(file.filename);
  });

  await Promise.all([...resizePromises]);

  req.images = images;

  next();
};
