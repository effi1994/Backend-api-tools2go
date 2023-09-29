const UserService = require('../services/users.service');
const jwt = require('jsonwebtoken');

class Token {
    constructor() {
        this.userService = new UserService();
    }

    isTokenExpired(token) {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            // Invalid token format
            return true;
        }

        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf-8'));
        if (!payload.exp) {
            // Token does not contain expiration time
            return true;
        }

        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        return currentTime > expirationTime;
    }

    async updateExpiryDate(token) {
        if (this.isTokenExpired(token)) {
            const decoded = jwt.decode(token);
            const userId = decoded.id;
            const user = await this.userService.getUserById(userId);
            const newToken = await this.userService.generateToken(user);
            return newToken;
        }
        return token;
    }
}

module.exports = new Token();
