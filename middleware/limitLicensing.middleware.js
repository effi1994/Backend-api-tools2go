const { PrismaClient } = require('@prisma/client');
const settings = require('../config/settings');
const jwt = require('jsonwebtoken');

// Create a single instance of Prisma Client
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
    try {
       
       
        
       

        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ message: 'No token provided' });


        
        let result = '';
        const decoded = jwt.decode(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized' });
        } else {

            let user = await prisma.users.findUnique({ where: { id: decoded.id } });
            if (!user) return res.status(401).json({ message: 'Unauthorized' });
            let CREDIT_CARD = await prisma.creditCard.findFirst({ where: { userId: decoded.id } });
            if (!CREDIT_CARD) return res.status(401).json({ message: 'You must add a credit card to your account' });

            if (parseInt(req.body.id) !=0) return next();
            const memberShip = user.memberShip;
            const numProducts = await prisma.products.findMany({ where: { userId: decoded.id } });
            switch (memberShip) {
                case 'BASIC':
                    result = numProducts.length >= settings.BASIC ? 'Limit exceeded, Want to make more money upgrade your account !' : '';
                    break;
                case 'PREMIUM':
                    result = numProducts.length >= settings.PREMIUM ? 'Limit exceeded, Want to make more money upgrade your account !' : '';
                    break;
                case 'BUSINESS':
                    result = '';
                    break;
            }
        }

        if (!result) {
            next();
        } else {
            console.log(result);
            return res.status(401).json({ message: result });
        }
    } catch (error) {
        return res.status(401).json({ message: error.message });
    } finally {
        // Close the Prisma Client connection when done with the middleware
        await prisma.$disconnect();
    }
}
