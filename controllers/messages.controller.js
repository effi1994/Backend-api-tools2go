const messagesService = require('../services/messages.service');

class MessagesController {
    constructor() {
        this.messagesService = new messagesService();
        
        
    }

    async getUsersSendAndGetMessages(req, res, next) {
        try {
            let userId = req.body.userId;
            let messages = await this.messagesService.getUsersSendAndGetMessages(userId);
            console.log(messages);
            res.status(200).json({ data: messages, message: 'getUsersSendAndGetMessages' });
        } catch (error) {
            next(error);
        }
    }



    async getMessagesForUser(req, res, next) {
        try {
            let userId = req.body.userId;
            let  userId2 = req.body.userId2;
            
            let messages = await this.messagesService.getMessagesForUser(userId,userId2);
            res.status(200).json({ data: messages, message: 'getMessagesForUser' });
        } catch (error) {
            next(error);
        }
    }

    async addMessageProduct(req, res, next) {
        try {
            let productId = req.body.productId;
            let message = req.body.message;
            let fromUserId = req.body.fromUserId;
            
            let newMessage = await this.messagesService.addMessageProduct(productId, message,fromUserId);
            res.status(200).json({ data: newMessage, message: 'addMessage' });
        } catch (error) {
            next(error);
        }
    }


    async addMessageToUser(req, res, next) {
        try {
            let toUserId = req.body.userId2;
            let message = req.body.message;
            let fromUserId = req.body.fromUserId;
            console.log(toUserId, message, fromUserId)

            let newMessage = await this.messagesService.addMessageToUser(fromUserId, toUserId, message);

            res.status(200).json({ data: newMessage, message: 'addMessage' });

        } catch (error) {

            next(error);

        }

    }

    




    async deleteMessage(req, res, next) {
        try {
            let messageId = req.body.messageId;
            await this.messagesService.deleteMessage(messageId);
            res.status(200).json({ data: messageId, message: 'deleteMessage' });
        } catch (error) {
            next(error);
        }
    }
   
}

module.exports = MessagesController;
