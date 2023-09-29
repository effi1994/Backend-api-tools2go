const { isEmpty } = require('../utilities/util');
const { PrismaClient } = require('@prisma/client')
const UsersService = require('../services/users.service');
const ProductsService = require('./products.service');
const sendPushNotification = require("../utilities/pushNotifications");
const createError = require('http-errors')
const { Expo } = require("expo-server-sdk");


class MessagesService {
    constructor() {
        this.messages = new PrismaClient().messages;
        this.userService = new UsersService();
        this.productsService = new ProductsService();
    }

    async getMessagesForUser(userId, userId2) {
        try {
            if (isEmpty(userId)) return createError(400, 'userId is empty');
            let users = await this.userService.getAllUsers();

            const mapUser = (id) => {
                const user = users.find((user) => user.id === id);
                return { id: user.id, name: user.fullName };
            }
            let isRead = true;

            await this.messages.updateMany({
                where: {
                    fromUserId: userId2,
                    toUserId: userId,
                    isRead: false,
                },
                data: {
                    isRead: true,
                },
            });




            const messages = await this.messages.findMany({
                where: {
                    OR: [
                        {
                            fromUserId: userId,
                            toUserId: userId2,
                        },
                        {
                            fromUserId: userId2,
                            toUserId: userId,
                        },
                    ],
                },
            });




            const resources = messages.map((message) => ({
                id: message.id,
                productId: message.productId,
                dateTime: message.messageDate,
                message: message.message,
                fromUser: mapUser(message.fromUserId),
                toUser: mapUser(message.toUserId),
            }));

            console.log(resources);

            return resources;

        } catch (error) {
            return createError(400, error.message);
        }
    }


    async getUsersSendAndGetMessages(userId) {
        try {
            if (!userId) return createError(400, 'userId is empty');
            
            // Fetch all users except the user with the given userId
            const users = await this.userService.getAllUsers();
            users = users.filter((user) => user.id !== userId);
    
            const mapUser = async (id) => {
                const user = users.find((user) => user.id === id);
                
                // Fetch unread messages from user to userId
                const messages = await this.messages.findMany({
                    where: {
                        fromUserId: id,
                        toUserId: userId,
                        isRead: false,
                    },
                });
    
                return { id: user.id, name: user.fullName, numberIsNotRead: messages.length };
            }
    
            const resources = [];
    
            // Map each user and collect the results in resources
            for (let i = 0; i < users.length; i++) {
                resources.push(await mapUser(users[i].id));
            }
    
            return resources;
    
        } catch (error) {
            return createError(400, error.message);
        }
    }
    



    async addMessageProduct(productId, message, fromUserId) {
        try {
            if (isEmpty(productId)) return createError(400, 'productId is empty');
            if (isEmpty(message)) return createError(400, 'message is empty');

            const product = await this.productsService.getProductById(productId);
            if (!product) return createError(400, 'Invalid productId.');

            const targetUser = await this.userService.getUserById(product.userId);
            if (!targetUser) return createError(400, 'Invalid userId.');

            let newMessages = await this.messages.create({
                data: {
                    fromUserId: fromUserId,
                    toUserId: targetUser.id,
                    productId: productId,
                    message: message,
                },
            });

            const { expoToken } = targetUser;

            if (Expo.isExpoPushToken(expoToken))
                await sendPushNotification(expoToken, message);


            return newMessages;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async deleteMessage(messageId) {
        try {
            if (isEmpty(messageId)) return createError(400, 'messageId is empty');

            await this.messages.delete({
                where: {
                    id: messageId,
                },
            });

            return true;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async addMessageToUser(userId, userId2, message) {
        try {
            if (isEmpty(userId)) return createError(400, 'userId is empty');
            if (isEmpty(userId2)) return createError(400, 'userId2 is empty');
            if (isEmpty(message)) return createError(400, 'message is empty');

            console.log("1")

            const targetUser = await this.userService.getUserById(userId2);
            const user = await this.userService.getUserById(userId);
            if (!targetUser) return createError(400, 'Invalid userId.');
            console.log("2")
            let newMessages = await this.messages.create({
                data: {
                    fromUserId: user.id,
                    toUserId: targetUser.id,
                    productId: 0,
                    message: message,
                },
            });


            console.log("3")

            let res = {
                id: newMessages.id,
                productId: newMessages.productId,
                dateTime: newMessages.messageDate,
                message: newMessages.message,
                fromUser: { id: user.id, name: user.fullName },
                toUser: { id: targetUser.id, name: targetUser.fullName },
            }

            console.log("3")


            const { expoToken } = targetUser;

            if (Expo.isExpoPushToken(expoToken))
                await sendPushNotification(expoToken, message);

            console.log(res);

            return res;
        } catch (error) {
            return createError(400, error.message);
        }

    }













}

module.exports = MessagesService;
