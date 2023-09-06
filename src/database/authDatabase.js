//const { PrismaClient } = require('@prisma/client');       Descomentar cuando esté setteado prisma

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
        throw err;
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
        throw err;
    } finally{
        await prisma.$disconnect();
    }
}

module.exports = {
    createUser,
    verifyUser
};
