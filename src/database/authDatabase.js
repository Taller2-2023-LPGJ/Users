const bcrypt = require('bcrypt');
const prisma = require('./client');
const Exception = require('../services/exception');

async function createUser(username, email, password, confirmedRegistration, passkey, isAdmin){
    try{
        await prisma.users.create({
            data: {
                username,
                email,
                password,
                confirmedRegistration,
                verified: isAdmin ? null : 'No',
                passkey,
                isAdmin,
                creationDate: new Date()

            },
        });
    } catch(err){
        switch (err.code) {
            case '23505': // Unique constraint violation
            case 'P2002': // Unique constraint violation
                throw new Exception('Username or email already taken.', 403);
            default:
                throw new Exception('An unexpected error has occurred. Please try again later.', 500);
          }
    }
}

async function verifyUser(userIdentifier, password, isAdmin){
	try {
        var user = await prisma.users.findFirst({
            where: {
                AND: [
                    { 
                        confirmedRegistration: true,
                        isAdmin: isAdmin
                    },
                    { OR:[
                            { username: userIdentifier },
                            { email: userIdentifier },
                        ],
                    }
                ]
            },
        });

        if(!user || !bcrypt.compareSync(password, user.password))
            return false;
        return user;
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function verifyUserGoogle(email){
	try {
        return await prisma.users.findFirst({
            where: { 
                email: email,
                isAdmin: false
            }
        });
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function getUser(username){
	try {
        return await prisma.users.findFirst({
            where: { username: username }
        });
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function searchUser(user){
	try {
        var userFound = await prisma.users.findFirst({
            where: { 
                OR:[
                    { username: user },
                    { email: user },
                ],
            }
        });
        return userFound;
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function updateUser(user){
	try {
        await prisma.users.update({
            where: { username: user.username },
            data: user
        })

    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function deleteUser(username){
	try {
        await prisma.users.delete({
            where: { username: username }
        });

    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function isAdmin(username, email){
	try {
        return await prisma.users.findFirst({
            where: { 
                OR: [
                    {username: username},
                    {email: email}
                ],
            },
            select: {
                isAdmin: true
            }
        });
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function getUsersPagination(query, isAdmin){
    var username = query.user;
    var email = query.email;
    var isBlocked = query.isBlocked;
    var verified = query.verified;

	try {
        var page = parseInt(query.currentpage) || 1;
        var amountperpage = parseInt(query.amountperpage) || 2;
        var startIndex = (page - 1) * amountperpage;
        var result = {};
        var where = {};
        where.isAdmin = isAdmin;
        if(username){
            where.username = {contains: username, mode: 'insensitive'}
        }
        if(email){
            where.email = {contains: email, mode: 'insensitive'}
        }
        if(isBlocked){
            if(isBlocked === 'true'){
                where.isBlocked = true;
            }
            if(isBlocked === 'false'){
                where.isBlocked = false;
            }
        }

        if(verified){
            where.verified = verified
        }

        var totalcount = await prisma.users.count({
            where: where
        });
        var totalpage = Math.ceil(totalcount / amountperpage);
        var currentpage = page || 0;
        result.totalcount = totalcount;
        result.totalpage = totalpage;
        result.currentpage = currentpage;

        result.paginateData = await prisma.users.findMany({
            take: amountperpage,
            skip: startIndex,
            where: where,
            select: {
                username: true,
                email: true,
                isBlocked: true,
                verified: true
            },
        });
        return result;
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

module.exports = {
    createUser,
    deleteUser,
    verifyUser,
    verifyUserGoogle,
    getUser,
    updateUser,
    searchUser,
    isAdmin,
    getUsersPagination
};
