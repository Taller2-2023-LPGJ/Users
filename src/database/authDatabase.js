//const { PrismaClient } = require('@prisma/client');
const Exception = require('../services/exception');

async function createUser(username, email, password){
    return;     //Quitar cuando esté setteado prisma
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
        switch (err.code) {
            case 'P2025': // Unique constraint violation
                throw new Exception('Username already taken.', 403);
            case 'P2025': // Primary key violation
                throw new Exception('Email already used.', 403);
            default:
                throw new Exception('An unexpected error has occurred. Please try again later.', 500);
          }
    } finally{
        await prisma.$disconnect();
    }
}

async function verifyUser(userIdentifier, password){
    return true;    //Quitar cuando esté setteado prisma
    const prisma = new PrismaClient();

	try {
        return await prisma.user.findUnique({
            where: {
                password,
                OR: [
                    { email: userIdentifier },
                    { username: userIdentifier },
                ],
            },
        });
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
