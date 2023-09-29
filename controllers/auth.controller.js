const AuthService = require('../services/auth.service');
const PushNotifications = require('../utils/pushNotifications');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async signUp(req, res, next) {
        try {
            const userData = req.body;
            console.log(userData);
            userData.isAdmin = false;
            userData.isOnline = false;
            userData.expoToken = '';
            const token = await this.authService.signup(userData);

            if (token instanceof Error) {
                // Handle the case where token is an instance of Error
                console.error('Error: User creation failed');
                // Respond with an appropriate error response
                return res.status(500).json({ error: token.message });
            } else {
                res.status(201).json({
                    data: {
                        token: token,
                    },
                    message: 'signup',
                });
            }



        } catch (error) {
            next(error);
        }
    }

    async logIn(req, res, next) {
        try {
            const userData = req.body;
            console.log(userData);
            const token = await this.authService.login(userData);

            if (token instanceof Error) {
                // Handle the case where token is an instance of Error
                console.error('Error: User creation failed');

                res.status(500).json({ error: token.message });
            }



            res.status(200).json({
                data: {
                    token: token,
                },
                message: 'login',
            });
        } catch (error) {
            next(error);
        }
    }

    async setExpoToken(req, res, next) {
        try {
            let token1 = req.header('x-auth-token');

            let tokenAndExpoToken = {
                token: token1,
                expoToken: req.body.token
            };
            await this.authService.setExpoToken(tokenAndExpoToken);
            await PushNotifications.sendPushNotificationSystem(tokenAndExpoToken.expoToken, 'הצלחה', 'התחברת בהצלחה');

            res.status(200).json({
                data: {
                    expoToken: tokenAndExpoToken.expoToken,
                },
                message: 'login',
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const email = req.body.email;
            const verificationCode = await this.authService.verifyEmail(email);
            
            res.status(200).json({
                data: {
                    verificationCode: verificationCode,
                },
                message: 'verifyEmail',
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            console.log("resetPassword");
            const email = req.body.email;
            await this.authService.resetPassword(email);

            res.status(200).json({
                data: {
                    email: email,
                },
                message: 'resetPassword',
            });
        } catch (error) {
            next(error);
        }
    }

    async verification(req, res, next) {
        try {
            const code = req.body.code;
            const email1 = req.body.email;
            const email = await this.authService.verification(email1, code);
            res.status(200).json({
                data: {
                    email: 'email',
                },
                message: 'verification',
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            await this.authService.changePassword(email, password);
            res.status(200).json({
                data: {
                    email: email,
                },
                message: 'changePassword',
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
