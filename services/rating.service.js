const { PrismaClient } = require('@prisma/client')
const createError = require('http-errors')
const { isEmpty, setPassword } = require('../utilities/util');
class RatingService {
    constructor() {
        this.rating = new PrismaClient().rating;
    }

    async getRatingByProductId(productId) {
        try {
            if (isEmpty(productId)) return createError(400, 'productId is empty');

            const myRating = await this.rating.findMany({
                where: {
                    productId: productId
                }
            });
            return myRating;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async editRating(rating) {
        try {
            if (isEmpty(rating)) throw new createError(400, 'Rating is empty');
            rating.postDate = new Date();
            const editRating = await this.rating.update({
                where: {
                    id: rating.id
                },
                data: {
                    ...rating
                }
            });
            return editRating;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async deleteRatings(ratingIds) {
        try {
            if (isEmpty(ratingIds)) throw new createError(400, 'Rating id is empty');
            await this.rating.deleteMany({
                where: {
                    id: {
                        in: ratingIds
                    }
                }
            });
            return ratingIds;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async addRating(rating) {
        try {
            if (isEmpty(rating)) throw new HttpException(400, 'rating is empty');

            delete rating.id;
            rating.postDate = new Date();

            const newRating = await this.rating.create({
                data: rating
            });
            return newRating;
        } catch (error) {
            return createError(400, error.message);
        }
    }
}


module.exports = new RatingService();