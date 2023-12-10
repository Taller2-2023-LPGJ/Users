const Exception = require('../services/exception');
const bcrypt = require('bcrypt');
const { prismaMock } = require('./singleton');
const authDatabase = require('../database/authDatabase');

jest.mock('bcrypt');

class PrismaError {
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
}

PrismaError.prototype = new Error();

describe('createUser', ()=>{
	test('createUser successfully', async () => {
        prismaMock.users.create.mockResolvedValue();
        let result = await authDatabase.createUser("julianquino", "julianquino@gmail.com", "Julianquino1", false, null, false);
        expect(result).toEqual(undefined);
    });

    test('createUser fail, Username or email already taken', async () => {
        prismaMock.users.create.mockImplementation(() => {
            throw new PrismaError('', 'P2002');
        });
        try {
            await authDatabase.createUser("julianquino", "julianquino@gmail.com", "Julianquino1", false, null, false);
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 403);
        }
    });

    test('createUser fail, Username or email already taken', async () => {
        prismaMock.users.create.mockImplementation(() => {
            throw new PrismaError('', '23505');
        });
        try {
            await authDatabase.createUser("julianquino", "julianquino@gmail.com", "Julianquino1", false, null, false);
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 403);
        }
    });

    test('createUser fail, An unexpected error has occurred. Please try again later', async () => {
        prismaMock.users.create.mockImplementation(() => {
            throw new PrismaError('', 'null');
        });
        try {
            await authDatabase.createUser("julianquino", "julianquino@gmail.com", "Julianquino1", false, null, false);
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('verifyUser', ()=>{
	test('verifyUser successfully', async () => {
        jest.spyOn(bcrypt, 'compareSync').mockImplementation( async () =>{
			return true;
		});
        prismaMock.users.findFirst.mockResolvedValue({username: "julianquino"});
        let result = await authDatabase.verifyUser("julianquino", "Julianquino1", false);
        expect(result.username).toEqual("julianquino");
    });

    test('verifyUser fail, An unexpected error has occurred. Please try again later', async () => {
        prismaMock.users.findFirst.mockResolvedValue(null);
        let result = await authDatabase.verifyUser("julianquino", "Julianquino1", false);
        expect(result).toEqual(false);
    });

    test('verifyUser fail, An unexpected error has occurred. Please try again later', async () => {
        prismaMock.users.findFirst.mockImplementation(() => {
            throw new PrismaError('', '');
        });
        try {
            await authDatabase.verifyUser("julianquino", "Julianquino1", false);
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('verifyUserGoogle', ()=>{
	test('verifyUserGoogle successfully', async () => {
        prismaMock.users.findFirst.mockResolvedValue({username: "julianquino"});
        let result = await authDatabase.verifyUserGoogle("julianquino@gmail.com");
        expect(result.username).toEqual("julianquino");
    });

    test('verifyUserGoogle fail, An unexpected error has occurred. Please try again later', async () => {
        prismaMock.users.findFirst.mockImplementation(() => {
            throw new PrismaError('', '');
        });
        try {
            await authDatabase.verifyUserGoogle("julianquino@gmail.com");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('getUser', ()=>{
	test('getUser successfully', async () => {
        prismaMock.users.findFirst.mockResolvedValue({username: "julianquino"});
        let result = await authDatabase.getUser("julianquino@gmail.com");
        expect(result.username).toEqual("julianquino");
    });

    test('getUser fail, An unexpected error has occurred. Please try again later', async () => {
        prismaMock.users.findFirst.mockImplementation(() => {
            throw new PrismaError('', '');
        });
        try {
            await authDatabase.getUser("julianquino@gmail.com");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('getUser', ()=>{
	test('getUser successfully', async () => {
        prismaMock.users.findFirst.mockResolvedValue({username: "julianquino"});
        let result = await authDatabase.searchUser("julianquino@gmail.com");
        expect(result.username).toEqual("julianquino");
    });

    test('getUser fail, An unexpected error has occurred. Please try again later', async () => {
        prismaMock.users.findFirst.mockImplementation(() => {
            throw new PrismaError('', '');
        });
        try {
            await authDatabase.searchUser("julianquino@gmail.com");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('updateUser', ()=>{
	test('updateUser successfully', async () => {
        prismaMock.users.update.mockResolvedValue({username: "julianquino"});
        let result = await authDatabase.updateUser({username: "julianquino@gmail.com"});
        expect(result).toEqual(undefined);
    });

    test('updateUser fail, An unexpected error has occurred. Please try again later', async () => {
        prismaMock.users.update.mockImplementation(() => {
            throw new PrismaError('', '');
        });
        try {
            await authDatabase.updateUser({username: "julianquino@gmail.com"});
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('deleteUser', ()=>{
	test('deleteUser successfully', async () => {
        prismaMock.users.delete.mockResolvedValue({username: "julianquino"});
        let result = await authDatabase.deleteUser("julianquino@gmail.com");
        expect(result).toEqual(undefined);
    });

    test('deleteUser fail, An unexpected error has occurred. Please try again later', async () => {
        prismaMock.users.delete.mockImplementation(() => {
            throw new PrismaError('', '');
        });
        try {
            await authDatabase.deleteUser("julianquino@gmail.com");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('isAdmin', ()=>{
	test('isAdmin successfully', async () => {
        prismaMock.users.findFirst.mockResolvedValue({username: "julianquino"});
        let result = await authDatabase.isAdmin("julianquino", "julianquino@gmail.com");
        expect(result.username).toEqual("julianquino");
    });

    test('isAdmin fail, An unexpected error has occurred. Please try again later', async () => {
        prismaMock.users.findFirst.mockImplementation(() => {
            throw new PrismaError('', '');
        });
        try {
            await authDatabase.isAdmin("julianquino", "julianquino@gmail.com");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('getUsersPagination', ()=>{
	test('getUsersPagination users successfully', async () => {
        prismaMock.users.count.mockResolvedValue(1);
        prismaMock.users.findMany.mockResolvedValue([{username: "julianquino", email: "julianquino@gmail.com", isBlocked: false}]);
        let query = {currentpage: 1, amountperpage:2, user:"julianquino", email: "julianquino@gmail.com", isBlocked: "false", verified: "yes"}
        let result = await authDatabase.getUsersPagination(query, false);
        expect(result.totalcount).toEqual(1);
        expect(result.paginateData[0].username).toEqual("julianquino");
    });

    test('getUsersPagination admins successfully', async () => {
        prismaMock.users.count.mockResolvedValue(1);
        prismaMock.users.findMany.mockResolvedValue([{username: "julianquino", email: "julianquino@gmail.com", isBlocked: "true"}]);
        let query = {currentpage: 1, amountperpage:2, user:"julianquino", email: "julianquino@gmail.com", isBlocked: true}
        let result = await authDatabase.getUsersPagination(query, true);
        expect(result.totalcount).toEqual(1);
        expect(result.paginateData[0].username).toEqual("julianquino");
    });

    test('getUsersPagination fail, An unexpected error has occurred. Please try again later', async () => {
        prismaMock.users.count.mockImplementation(() => {
            throw new PrismaError('', 500);
        });
        try {
            let query = {currentpage: 1, amountperpage:2, user:"julianquino", email: "julianquino@gmail.com", isBlocked: "true"}
            let result = await authDatabase.getUsersPagination(query, false);
            expect(result).toEqual(1);
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});