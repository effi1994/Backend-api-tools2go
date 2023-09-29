const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const settings = require('../config/settings');
const { PrismaClient } = require('@prisma/client')
const createError = require('http-errors');
const { setPassword, comparePassword } = require('../utilities/util');

class UserService {
    constructor() {
        this.users = new PrismaClient().users;
    }


    async getUserById(userId) {
        try {
            if (!userId) return createError(400, 'userId is empty');
            const findUser = await this.users.findUnique({ where: { id: userId } });
            if (!findUser) return createError(409, "User doesn't exist");
            return findUser;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async getAllUsers() {
        try {
            const allUsers = await this.users.findMany();
            return allUsers;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async getUserByPorductId(productId) {
        try {
            if (!productId) return createError(400, 'productId is empty');
            const findUser = await this.users.findFirst({ where: { products: { some: { id: productId } } } });
            if (!findUser) return createError(409, "User doesn't exist");
            return findUser;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async getUserByToken(token) {
        try {
            if (!token) return createError(400, 'token is empty');
            const findUser = await this.users.findFirst({ where: { token: token } });
            if (!findUser) return createError(409, "User doesn't exist");
            return findUser;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async createUser(newUser) {
        try {
            if (!newUser) return createError(400, 'newUser is empty');
            const findEmail = await this.users.findUnique({ where: { email: newUser.email } });
            if (findEmail) return createError(409, `This email ${newUser.email} already exists`);

            const findPhone = await this.users.findUnique({ where: { phone: newUser.phone } });
            if (findPhone) return createError(409, `This phone ${newUser.phone} already exists`);
           // newUser.password = await setPassword(newUser.password);
            newUser.imageProfile = newUser.imageProfile ? newUser.imageProfile : '';
            const user = this.convrtSignupUserToUser(newUser);
            delete user.id;

            const createUserData = await this.users.create({ data: { ...user } });
            createUserData.token = this.updateToken(createUserData);
            await this.updateTokenInDb(createUserData);

            return createUserData.token;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async updateTokenInDb(user) {
        try {
            if (!user) return createError(400, 'user is empty');
            const findUser = await this.users.findUnique({ where: { id: user.id } });
            if (!findUser) return createError(409, "User doesn't exist");
            const updateUserData = await this.users.update({ where: { id: user.id }, data: { ...user } });
            return updateUserData;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async updateUser(userData) {
        try {
            if (!userData) return createError(400, 'userData is empty');
            const findUser = await this.users.findUnique({ where: { email: userData.email } });
            if (!findUser) return createError(409, "User doesn't exist");
            const user = this.convrtSignupUserToUser(userData);
            const updateUserData = await this.users.update({ where: { id: userData.id }, data: { ...user } });
            return updateUserData;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async deleteUser(userId) {
        try {
            if (!userId) return createError(400, 'userId is empty');
            const findUser = await this.users.findUnique({ where: { id: userId } });
            if (!findUser) return createError(409, "User doesn't exist");
            const deleteUserData = await this.users.delete({ where: { id: userId } });
            return deleteUserData;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    createToken(user) {
        try {
            const token = jwt.sign(
                {
                    email: user.email,
                    imageProfile: user.imageProfile,
                    memberShip: user.memberShip,
                    id: user.id,
                },
                settings.keyToken,
                {
                    algorithm: 'HS256',
                    expiresIn: '30d',
                }
            );
            return token;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    updateToken(user) {
        try {
            const token = jwt.sign(
                {
                    email: user.email,
                    id: user.id,
                    memberShip: user.memberShip,
                    name: user.fullName,
                    phone: user.phone,
                },
                settings.keyToken,
                {
                    algorithm: 'HS256',
                    expiresIn: '30d',
                }
            );
            return token;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    convrtSignupUserToUser(newUser) {
        try {
            const user = {
                id: newUser.id,
                email: newUser.email,
                password: newUser.password,
                token: this.createToken(newUser),
                fullName: newUser.fullName,
                phone: newUser.phone,
                city: newUser.city,
                expoToken: newUser.expoToken,
                imageProfile: "",
                isAdmin: false,
                isOnline: false,
                memberShip: this.getMemberShip(newUser.memberShip),
                verificationCode: '',
            };
            return user;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    getMemberShip(memberShip) {
        try {
            switch (memberShip) {
                case 'BASIC':
                    return 'BASIC';
                case 'PREMIUM':
                    return 'PREMIUM';
                case 'BUSINESS':
                    return 'BUSINESS';
                default:
                    return 'BASIC';
            }
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async login(userData) {
        try {
            if (!userData) return createError(400, 'userData is empty');
            const findUser = await this.users.findUnique({ where: { email: userData.email } });
            console.log(findUser, 'findUser');
            if (!findUser) return createError(409, "User doesn't exist");
            const isPasswordMatching = userData.password === findUser.password;
            if (!isPasswordMatching) return createError(409, 'Password is not matching');
            return findUser.token;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async getUserNmaeById(userId) {
        try {
            if (!userId) return createError(400, 'userId is empty');
            const findUser = await this.users.findUnique({ where: { id: userId } });
            if (!findUser) return createError(409, "User doesn't exist");
            return findUser.fullName;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async generateToken(user) {
        try {
            const token = jwt.sign(
                {
                    email: user.email,
                    imageProfile: user.imageProfile,
                    id: user.id,
                    memberShip: user.memberShip,
                },
                settings.keyToken,
                {
                    algorithm: 'HS256',
                    expiresIn: '30d',
                }
            );

            await this.updateTokenInDb({ ...user, token: token });

            return token;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async getUserById(userId) {
        try {
            if (!userId) return createError(400, 'userId is empty');
            const findUser = await this.users.findUnique({ where: { id: userId } });
            if (!findUser) return createError(409, "User doesn't exist");
            return findUser;
        } catch (error) {
            return createError(400, error.message);
        }
    }

    async getUserProfile(userId) {
        try {
            if (!userId) return createError(400, 'userId is empty');
            const findUser = await this.users.findUnique({
                where: { id: userId },include:{creditCard:true}});
            if (!findUser) return createError(409, "User doesn't exist");
            console.log(findUser);


            return findUser;
        } catch (error) {
            return createError(400, error.message);
        }
    }


}

module.exports = UserService;
