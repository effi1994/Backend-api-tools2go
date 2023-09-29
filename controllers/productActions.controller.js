const ProductActionsService = require('../services/productActions.service');

class ProductActionsController {
    constructor() {
        this.ProductActionsService = new ProductActionsService();
    }


    async checkProductAvailability(req, res, next) {
        try {
            let productId = req.body.productId;
            let dateToRent = req.body.dateToRent;
            let dateFromRent = req.body.dateFromRent;

            let isAvailable = await this.ProductActionsService.getProductAvailability(productId,dateFromRent, dateToRent);
            console.log(isAvailable);
            res.status(200).json({ data: isAvailable, message: 'checkProductAvailability' });
        } catch (error) {
            next(error);
        }
    }

    async payRent(req, res, next) {
        try {
            let userIdRenter = req.body.userId;
            let productId = req.body.productId;
            let dateFromRent = req.body.dateFromRent;
            let dateToRent = req.body.dateToRent;
            let price = req.body.price;

            let isPaid = await this.ProductActionsService.payRent(userIdRenter, productId, dateFromRent, dateToRent, price);
            res.status(200).json({ data: isPaid, message: 'payRent' });
        } catch (error) {
            next(error);
        }
    }


    async getMyProductsRenting(req, res, next) {
        try {
            let userId = req.body.userId;
            let myProductsRenting = await this.ProductActionsService.getMyProductsRenting(userId);
            res.status(200).json({ data: myProductsRenting, message: 'getMyProductsRenting' });
        } catch (error) {
            next(error);
        }
    }


    async addImageGetProduct(req, res, next) {
        try {
            let imageGetProduct = req.body;
            console.log(imageGetProduct);
            let imageGetProductAdded = await this.ProductActionsService.addImageGetProduct(imageGetProduct);
            res.status(200).json({ data: imageGetProductAdded, message: 'addImageGetProduct' });
        } catch (error) {
            next(error);
        }
    }





    

    async getMyProductsRentingHistory(req, res, next) {
        try {
            let userId = req.body.userId;
            let myProductsRentingHistory = await this.ProductActionsService.getMyProductsRentingHistory(userId);
            res.status(200).json({ data: myProductsRentingHistory, message: 'getMyProductsRentingHistory' });
        } catch (error) {
            next(error);
        }
    }

    async getProductRentingHistoryByProductIdAndUserId(req, res, next) {
        try {
            let userId = req.body.userId;
            let productId = req.body.productId;
            let productRentingHistory = await this.ProductActionsService.getProductRentingHistoryByProductIdAndUserId(userId, productId);
            res.status(200).json({ data: productRentingHistory, message: 'getProductRentingHistoryByProductIdAndUserId' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductActionsController;
