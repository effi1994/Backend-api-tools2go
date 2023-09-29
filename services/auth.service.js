const { isEmpty, setPassword } = require('../utilities/util');
const UserService = require('./users.service');
const { PrismaClient } = require('@prisma/client');
const createMessageHtml = require('../utilities/createMessageHtml');
const emailService = require('./email.service');
const createError = require('http-errors')
class AuthService {
    constructor() {
        this.userService = new UserService();
        this.users = new PrismaClient().users;
    }

    async signup(userData) {
        try {
            if (isEmpty(userData)) return createError(400, 'userData is empty');
            let token = await this.userService.createUser(userData);
            return token;
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }

    async login(userData) {
        try {
            if (isEmpty(userData)) return createError(400, 'userData is empty');
            const token = await this.userService.login(userData);
            return token;
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }

    async verifyEmail(email) {
        try {
            if (isEmpty(email)) return createError(400, 'email is empty');
            let verificationCode = this.generateRandomVerificationCode();
            let messages = createMessageHtml.createHtmlMessageVerifyEmail(verificationCode);
            await emailService.sendVerifyCodeByEmail(email, messages, 'Verify Email');
            return verificationCode;
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }

    async resetPassword(email) {
        try {
            if (isEmpty(email)) return createError(400, 'email is empty');
            console.log(email)
            let user = await this.users.findFirst({
                where: {
                    email: email,
                },
            });
            console.log(user)
            if (isEmpty(user)) return createError(400, 'email not found');
            const verificationCode = this.generateRandomVerificationCode();
            console.log(verificationCode)
            await this.users.update({
                where: {
                    id: user.id,
                },
                data: {
                    verificationCode: verificationCode,
                },
            });
            const message = createMessageHtml.createHtmlMessageResetPassword(verificationCode);
            await emailService.sendVerifyCodeByEmail(email, message, 'Reset Password');
        } catch (error) {
            return createError(400, error.message); 
        }
    }

    async verification(email, verificationCode) {
        try {
            if (isEmpty(email)) return createError(400, 'email is empty');
            if (isEmpty(verificationCode)) throw new HttpException(400, 'verification code is empty');
            let user = await this.users.findFirst({
                where: {
                    email: email,
                },
            });
            if (isEmpty(user)) return createError(400, 'email not found');
            if (user.verificationCode !== verificationCode) throw new HttpException(400, 'verification code not match');
            return user.email;
        } catch (error) {
            throw new HttpException(400, error.message);
        }
    }

    async changePassword(email, password) {
        try {
            if (isEmpty(email)) return createError(400, 'email is empty');
            if (isEmpty(password)) return createError(400, 'password is empty');
            let user = await this.users.findFirst({
                where: {
                    email: email,
                },
            });
            if (isEmpty(user)) return createError(400, 'email not found');
            
            await this.users.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: password,
                },
            });
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async setExpoToken(tokenAndExpoToken) {
        try {
            if (isEmpty(tokenAndExpoToken)) return createError(400, 'tokenAndExpoToken is empty');
            let user = await this.userService.getUserByToken(tokenAndExpoToken.token);
            if (isEmpty(user)) throw new HttpException(400, 'user not found');
            await this.users.update({
                where: {
                    id: user.id,
                },
                data: {
                    expoToken: tokenAndExpoToken.expoToken,
                },
            });
        } catch (error) {
            return createError(400, error.message);
        }
    }

    generateRandomVerificationCode() {
        const length = Math.floor(Math.random() * 2) + 5; // Random number between 4 and 6
        const characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        return code;
    }
}

module.exports = AuthService;
