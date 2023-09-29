const UserService = require('../services/users.service');

class UsersController {
    constructor() {
        this.userService = new UserService();
    }

    async getAllUsers(req, res, next) {
        try {
            const allUsers = await this.userService.getAllUsers();
            res.status(200).json({ data: allUsers, message: 'find all users' });
        } catch (error) {
            next(error);
        }
    }

    async getUserByToken(req, res, next) {
        try {
            let token = req.body.token;
            const user = await this.userService.getUserByToken(token);
            res.status(200).json({ data: user, message: 'find user by token' });
        } catch (error) {
            next(error);
        }
    }

    async createUser(req, res, next) {
        try {
            let newUser = req.body;
            const user = await this.userService.createUser(newUser);
            res.status(200).json({ data: user, message: 'create user' });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            let editUser = req.body;
            console.log(editUser);
            const user = await this.userService.updateUser(editUser);
            res.status(200).json({ data: user, message: 'update user' });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            let id = req.body.userId;
            const user = await this.userService.deleteUser(id);
            res.status(200).json({ data: user, message: 'delete user' });
        } catch (error) {
            next(error);
        }
    }

    async getUserProfile(req, res, next) {
        try {
            let userId = req.body.userId;
            const user = await this.userService.getUserProfile(userId);
            res.status(200).json({ data: user, message: 'getUserProfile' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UsersController;
