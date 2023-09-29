const { NextFunction, Request, Response } = require('express');
const RatingService = require('../services/rating.service');

class RatingController {
    constructor() {
        this.ratingService = new RatingService();
    }

    async getProductRating(req, res, next) {
        try {
            let productId = req.body.productId;
            let productRating = await this.ratingService.getRatingByProductId(productId);
            res.status(200).json({ data: productRating, message: 'getProductRating' });
        } catch (error) {
            next(error);
        }
    }

    async addRating(req, res, next) {
        try {
            let rating = req.body.rating;
            let isAdded = await this.ratingService.addRating(rating);
            res.status(200).json({ data: isAdded, message: 'addRating' });
        } catch (error) {
            next(error);
        }
    }

    async editRating(req, res, next) {
        try {
            let rating = req.body.rating;
            let isEdited = await this.ratingService.editRating(rating);
            res.status(200).json({ data: isEdited, message: 'editRating' });
        } catch (error) {
            next(error);
        }
    }

    async deleteRating(req, res, next) {
        try {
            let ratingIds = req.body.ratingIds;
            let isDeleted = await this.ratingService.deleteRatings(ratingIds);
            res.status(200).json({ data: isDeleted, message: 'deleteRating' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RatingController;
