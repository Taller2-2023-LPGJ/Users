const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const Exception = require('../services/exception');

async function createUser(username, email, password){
    const prisma = new PrismaClient();

    try{
        await prisma.users.create({
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
            case 'P2002': // Unique constraint violation
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
        var user = await prisma.users.findFirst({
            where: {
                OR: [
                    { username: userIdentifier },
                    { email: userIdentifier },
                ],
            },
        });

        if(!user || !bcrypt.compareSync(password, user.password))
            return false;
        return user.username;
    } catch(err){
        console.log(err);
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    } finally{
        await prisma.$disconnect();
    }
}

module.exports = {
    createUser,
    verifyUser
};
