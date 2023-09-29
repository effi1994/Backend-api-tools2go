const { Expo, ExpoPushMessage } = require('expo-server-sdk');
const createError = require('http-errors')
const { isEmpty } = require('../utilities/util');

class PushNotifications {
    async sendPushNotification(expoToken, title, name, body, data) {
        try {
            if (isEmpty(expoToken)) return createError(400, 'token is empty');
            if (isEmpty(title)) return createError(400, 'title is empty');
            if (isEmpty(body)) return createError(400, 'body is empty');
            if (isEmpty(data)) return createError(400, 'data is empty');

            const expo = new Expo();
            const messages = [];
            messages.push({
                to: expoToken,
                sound: 'default',
                title: name,
                subtitle: title,
                body: body,
                data: data,
            });

            const chunks = expo.chunkPushNotifications(messages);
            const tickets = [];

            (async () => {
                for (let chunk of chunks) {
                    try {
                        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                        tickets.push(...ticketChunk);
                    } catch (error) {
                        return createError(400, error.message);
                    }
                }
            })();
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async sendPushNotificationSystem(expoToken, title, body) {
        try {
            if (isEmpty(expoToken)) return createError(400, 'token is empty');
            if (isEmpty(title)) return createError(400, 'title is empty');
            if (isEmpty(body)) return createError(400, 'body is empty');
            

            const expo = new Expo();
            const messages = [];
            messages.push({
                to: expoToken,
                sound: 'default',
                title: title,
                body: body,
            });

            const chunks = expo.chunkPushNotifications(messages);
            const tickets = [];

            (async () => {
                for (let chunk of chunks) {
                    try {
                        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                        tickets.push(...ticketChunk);
                    } catch (error) {
                        return createError(400, error.message);
                    }
                }
            })();
        } catch (error) {
            return createError(400, error.message);
        }
    }
}

module.exports = new PushNotifications();
