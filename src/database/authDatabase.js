const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const Exception = require('../services/exception');

async function createUser(username, email, password){
    const prisma = new PrismaClient();

    try{
        await prisma.user.create({
            data: {
                username,
                email,
                password,
            },
        });
    } catch(err){
        console.log(err);
        switch (err.code) {
            case '23505': // Unique constraint violation
                throw new Exception('Username or email already taken.', 403);
            default:
                throw new Exception('An unexpected error has occurred. Please try again later.', 500);
          }
    } finally{
        await prisma.$disconnect();
    }
}

async function verifyUser(userIdentifier, password){
    const prisma = new PrismaClient();

	try {
        var user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: userIdentifier },
                    { username: userIdentifier },
                ],
            },
        });

        return user && bcrypt.compareSync(password, user.password);
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    } finally{
        await prisma.$disconnect();
    }
}

module.exports = {
    createUser,
    verifyUser
};
