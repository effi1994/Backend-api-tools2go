const { isEmpty } = require('../utilities/util');
const sendPushNotification = require("../utilities/pushNotifications");
const createError = require('http-errors')
const { Expo } = require("expo-server-sdk");
const { PrismaClient } = require('@prisma/client');
const config = require("config");
const path = require("path");
const fs = require("fs");

const outputFolder = "public/assets";
class ProductActionsService {
    constructor() {
        this.productAction = new PrismaClient().productActions;
        this.products = new PrismaClient().products;
        this.users = new PrismaClient().users;
        this.creditCard = new PrismaClient().creditCard;
        this.bankMiddeleware = new PrismaClient().bankMiddeleware;
        this.bankMoney = new PrismaClient().bankMoney;
        this.messages = new PrismaClient().messages;
        this.imageGetProduct = new PrismaClient().imageGetProduct;


    }

    async getProductAvailability(productId, dateFromRent, dateToRent) {
        try {
            if (isEmpty(productId)) return createError(400, 'userId is empty');
            if (isEmpty(dateToRent)) return createError(400, 'dateToRent is empty');
            console.log(productId, dateToRent);
            let isAvailable = true;


            // Create a function to remove the time part from a Date object
            const removeTimePart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

            // Convert dateToRent to date-only
            const dateToRentDateOnly = removeTimePart(new Date(dateToRent));
            const dateFromRentDateOnly = removeTimePart(new Date(dateFromRent));

            console.log(dateToRentDateOnly, dateFromRentDateOnly);


            // Query products and compare date parts

            let product = await this.productAction.findFirst({
                where: {
                    productId: productId,
                    OR: [
                        {
                            dateFromRent: {
                                lte: dateFromRentDateOnly,
                            },
                            dateToRent: {
                                gte: dateFromRentDateOnly,
                            },
                        },
                        {
                            dateFromRent: {
                                lte: dateToRentDateOnly,
                            },
                            dateToRent: {
                                gte: dateToRentDateOnly,
                            },
                        },
                        {
                            dateFromRent: {
                                gte: dateFromRentDateOnly,
                            },
                            dateToRent: {
                                lte: dateToRentDateOnly,
                            },
                        },
                    ],
                },
            });



            if (product) {
                isAvailable = false;
            }
            return isAvailable;


        } catch (error) {
            return createError(400, error.message);
        }
    }

    async rentMyProduct(rentProduct) {
        try {
            if (isEmpty(rentProduct)) return createError(400, 'rentProduct is empty');

            delete rentProduct.id;
            rentProduct.dateFromRent = new Date(rentProduct.dateFromRent);
            rentProduct.dateToRent = new Date(rentProduct.dateToRent);

            await this.productAction.create({
                data: rentProduct,
            });
            return true;
        } catch (error) {
            return createError(400, error.message)
        }
    }

    async payRent(userIdRenter, productId, dateFromRent, dateToRent, price) {
        try {
            if (isEmpty(userIdRenter)) return createError(400, 'userIdRenter is empty');
            if (isEmpty(productId)) return createError(400, 'productId is empty');
            if (isEmpty(dateFromRent)) return createError(400, 'dateFromRent is empty');
            if (isEmpty(dateToRent)) return createError(400, 'dateToRent is empty');
            if (isEmpty(price)) return createError(400, 'price is empty');
            let card = await this.creditCard.findFirst({
                where: {
                    userId: userIdRenter,
                },
            });
            if (!card) return createError(400, 'card is empty');
            let product = await this.products.findFirst({
                where: {
                    id: productId,
                },
            });
            if (!product) return createError(400, 'product is empty');
            let user = await this.users.findFirst({
                where: {
                    id: product.userId,
                },
            });

            if (!user) return createError(400, 'user is empty');
            let bankMiddleware = await this.bankMiddeleware.findFirst({
                where: {
                    creditCardId: card.id,
                },
            });




            if (!bankMiddleware) return createError(400, 'bankMiddleware is empty');
            if (bankMiddleware.money < price) return createError(400, 'no money in bank account');
            let newMoney = bankMiddleware.money - price;
            await this.bankMiddeleware.update({
                where: {
                    id: bankMiddleware.id,
                },
                data: {
                    money: newMoney,
                },
            });

            let bankMoney = await this.bankMoney.create({
                data: {
                    money: price,
                    userId: user.id,
                },
            });

            if (!bankMoney) return createError(400, 'bankMoney is empty');


            // Create a function to remove the time part from a Date object
            const removeTimePart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

            // Convert dateToRent to date-only
            const dateToRentDateOnly = removeTimePart(new Date(dateToRent));
            const dateFromRentDateOnly = removeTimePart(new Date(dateFromRent));
            console.log(dateToRentDateOnly, dateFromRentDateOnly);

            let productAction = await this.productAction.create({
                data: {
                    dateFromRent: dateFromRentDateOnly,
                    dateToRent: dateToRentDateOnly,
                    price: price,
                    productId: productId,
                    userIdRenter: userIdRenter,
                },
            });
            const formatDate = (inputDate) => {

                const date = new Date(inputDate);

                // Extract year, month, day, hours, and minutes
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');

                // Format the date and time
                return `${year}/${month}/${day} ${hours}:${minutes}`;
            };
            let userIdRenter = await this.userIdRenter.findFirst({
                where: {
                    id: userIdRenter,
                },
            });

            let messageToUserE = `The user ${userIdRenter.fullName} ordered your product ${product.name} from date ${formatDate(dateFromRent)} to date ${formatDate(dateToRent)} at a price of ${price} $`;

            await this.messages.create({
                data: {
                    fromUserId: userIdRenter,
                    toUserId: user.id,
                    message: messageToUserE,
                    productId: productId,
                },
            });

            const { expoToken } = user;

            if (Expo.isExpoPushToken(expoToken))
                await sendPushNotification(expoToken, message);




            if (!productAction) return createError(400, 'productAction is empty');

            return true;

        } catch (error) {
            return createError(400, error.message)
        }
    }

    async getMyProductsRentingHistory(userId) {
        try {
            if (isEmpty(userId)) return createError(400, 'userId is empty');

            let myProductsRentingHistory = await this.productAction.findMany({
                where: {
                    product: {
                        userId: userId,
                    },
                },
            });

            myProductsRentingHistory = this.reduceFeeFromProductActions(myProductsRentingHistory);

            return myProductsRentingHistory;
        } catch (error) {
            return createError(400, error.message)
        }
    }

    reduceFeeFromProductActions(myProductsRentingHistory) {
        myProductsRentingHistory.forEach(productAction => {
            productAction.price = productAction.price - this.getFee(productAction.price);
        });
        return myProductsRentingHistory;
    }

    getFee(price) {
        return price * 0.1;
    }

    async getProductRentingHistoryByProductIdAndUserId(userId, productId) {
        try {
            if (isEmpty(productId)) return createError(400, 'productId is empty');

            let productRentingHistory = await this.productAction.findMany({
                where: {
                    productId: productId,
                    product: {
                        userId: userId,
                    }
                },
            });

            productRentingHistory = this.reduceFeeFromProductActions(productRentingHistory);

            return productRentingHistory;
        } catch (error) {
            return createError(400, error.message)
        }
    }


    async getMyProductsRenting(userId) {
        try {
            if (isEmpty(userId)) return createError(400, 'userId is empty');

            let date = new Date();
            const removeTimePart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const dateToRentDateOnly = removeTimePart(new Date(date));

            let myProductsRenting = await this.productAction.findMany({
                where: {
                    userIdRenter: userId,
                    dateToRent: {
                        gte: dateToRentDateOnly,
                    },
                },
            });

            let products = await this.products.findMany({});

            const mapProductAction = (productAction) => {
                let product = products.find((product) => product.id == productAction.productId);
                return {
                    productId: product.id,
                    name: product.name,
                }
            }

            let res = [];

            for (let i = 0; i < myProductsRenting.length; i++) {
                let imageGetProduct = [];
                imageGetProduct = await this.imageGetProduct.findMany({
                    where: {
                        userId: myProductsRenting[i].userIdRenter,
                        productId: myProductsRenting[i].productId,
                        actionId: myProductsRenting[i].id,
                    },
                });

                res.push({
                    productAction: {
                        id: myProductsRenting[i].id,
                        dateFromRent: myProductsRenting[i].dateFromRent,
                        dateToRent: myProductsRenting[i].dateToRent,
                        price: myProductsRenting[i].price,
                        product: mapProductAction(myProductsRenting[i]),
                    },
                    imageGetProduct: this.listingMapper(imageGetProduct),
                });

            }

            return res;
        } catch (error) {
            return createError(400, error.message)
        }
    }


    listingMapper(imageGetProduct) {
        let image = [];
        const baseUrl = config.get("assetsBaseUrl");
        imageGetProduct.forEach(element => {
            image.push(
                {
                    url: `${baseUrl}${element.fileName}_full.jpg`,
                    thumbnailUrl: `${baseUrl}${element.fileName}_thumb.jpg`,
                    id: element.id,
                    productId: element.productId,
                    userId: element.userId,

                }
            )
        });
        return image;

    }



    async addImageGetProduct(imageGetProduct) {
        try {
            if (isEmpty(imageGetProduct)) return createError(400, 'imageGetProduct is empty');

            delete imageGetProduct.id;

            await this.imageGetProduct.create({
                data: imageGetProduct,
            });

            return true;
        } catch (error) {
            return createError(400, error.message)
        }
    }

}

module.exports = ProductActionsService;
