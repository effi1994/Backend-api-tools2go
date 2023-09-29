const ProductsService = require('../services/products.service');

class ProductsController {
    constructor() {
        this.productService = new ProductsService();
    }

    async getAllProducts(req, res, next) {
        try {
            const Products = await this.productService.getAllProducts();
            console.log(Products);
            res.status(200).json({ data: Products, message: 'getAll' });
        } catch (error) {
            next(error);
        }
    }

    async getMyProduct(req, res, next) {
        try {
            let userId = req.body.userId;
            const Products = await this.productService.getMyProduct(userId);
            res.status(200).json({ data: Products, message: 'getMyProduct' });
        } catch (error) {
            next(error);
        }
    }

    async addProduct(req, res, next) {
        try {
            let productAndImagesUrl = req.body;
            console.log(productAndImagesUrl);
            let product = await this.productService.addProduct(productAndImagesUrl.product);
            console.log(product);
            let productImages = productAndImagesUrl.images;
            productImages.forEach(image => {
                image.productId = product.id;
            });

            let p = await this.productService.addProductImages(productImages);
            let user = await this.productService.getUserProduct(product.userId);
            productAndImagesUrl.product = product;
            productAndImagesUrl.images = p;
            productAndImagesUrl.user = user;

            res.status(200).json({ data: productAndImagesUrl, message: 'addProduct' });



            
        } catch (error) {
            next(error);
        }
    }

    async editProduct(req, res, next) {
        try {
            let productAndImagesUrl = req.body;
            productAndImagesUrl.product.postDate = new Date();
            productAndImagesUrl.product = await this.productService.editProduct(productAndImagesUrl.product);
            let productImages = productAndImagesUrl.images;
            productImages.forEach(image => {
                image.productId = productAndImagesUrl.product.id;
            });

            let p = await this.productService.addProductImages(productImages);
            let user = await this.productService.getUserProduct(productAndImagesUrl.product.userId);
            productAndImagesUrl.images = p;
            productAndImagesUrl.user = user;
           
            res.status(200).json({ data: productAndImagesUrl, message: 'addProduct' });
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            console.log(req.body);
            let id = req.body.id;
            const deleteId = await this.productService.deleteProducts(id);
            res.status(200).json({ data: deleteId, message: 'deleteProduct' });
        } catch (error) {
            next(error);
        }
    }

    initDefaultProductAndImage() {
        let product = {
            id: 0,
            name: '',
            price: 0,
            description: '',
            postDate: new Date(),
            category: '',
            userId: 0,
            productId: 0,
        };
        let images = [];
        let productAndImage = {
            product: product,
            images: images,
        };
        return productAndImage;
    }

    


}

module.exports = ProductsController;
