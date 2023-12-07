const userService = require('../services/userService');
const Exception = require('../services/exception');
const authDatabase = require('../database/authDatabase');

jest.mock('../database/authDatabase');
jest.mock("axios");

let res = {
    statusCode: 500,
    jsonVal: {},
    status: jest.fn().mockImplementation((val) => {
        res = {...res, statusCode: val};
        return res;
    }),
    json: jest.fn().mockImplementation((val) => {
        res = {...res, jsonVal: val};
        return res;
    })
}

describe('Search user', ()=>{
	test('Search user successfully', async () => {
        jest.spyOn(authDatabase, 'searchUser').mockImplementation( async () =>{
			return {"username": "julianquino", "email": "julianquino@gmail.com"};
		});
        let user = await userService.searchUser( { "username": "julianquino" });
        expect(user.name).toEqual("julianquino");
        expect(user.email).toEqual("julianquino@gmail.com");
    });

	test('Search user fail', async () => {
		jest.spyOn(authDatabase, 'searchUser').mockImplementation( async () =>{
			return null;
		});
        try {
            let user = await userService.searchUser( { "username": "julianquino" });
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('Search user fail server', async () => {
		jest.spyOn(authDatabase, 'searchUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            let user = await userService.searchUser( { "username": "julianquino" });
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('Block a user', ()=>{
	test('Block a user successfully', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: false, blockDate: null};
		});
        await userService.blockUser("julianquino");
        expect(1).toEqual(1);
    });

	test('Block a user fail user', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            let user = await userService.blockUser("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('Block a user, user already blocked', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: true, blockDate: null};
		});
        try {
            let user = await userService.blockUser("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 401);
        }
    });

    test('Block a user, fail server', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            let user = await userService.blockUser("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('He is an administrator', ()=>{
	test('He is an administrator successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", isAdmin: true};
		});
        let isAdmin = await userService.isAdmin("julianquino");
        expect(isAdmin).toEqual(true);
    });

    test('Is not an administrator successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", isAdmin: false};
		});
        let isAdmin = await userService.isAdmin("julianquino");
        expect(isAdmin).toEqual(false);
    });

	test('He is an administrator, fail User not found', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            let user = await userService.isAdmin("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('He is an administrator, fail server', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            let user = await userService.isAdmin("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('unlocks user', ()=>{
	test('unlocks user successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: false, blockDate: null};
		});
        await userService.unlockUser("julianquino");
        expect(1).toEqual(1);
    });

    test('He is an administrator, fail User not found', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await userService.unlockUser("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('unlocks user fail, user already blocked', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: true, blockDate: null};
		});
        try {
            await userService.unlockUser("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 403);
        }
    });

    test('He is an administrator, fail server', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await userService.unlockUser("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('Get administrators', ()=>{
	test('Get administrators successfully', async () => {
        jest.spyOn(authDatabase, 'getUsersPagination').mockImplementation( async () =>{
			return [];
		});
        let admins = await userService.getAdmins({});
        expect(admins).toEqual([]);
    });

    test('Get administrators fail', async () => {
		jest.spyOn(authDatabase, 'getUsersPagination').mockImplementation( async () =>{
			return null;
		});
        try {
            let admins = await userService.getAdmins({});
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('Get users', ()=>{
	test('Get users successfully', async () => {
        jest.spyOn(authDatabase, 'getUsersPagination').mockImplementation( async () =>{
			return [];
		});
        let admins = await userService.getUsers({});
        expect(admins).toEqual([]);
    });

    test('Get users fail', async () => {
		jest.spyOn(authDatabase, 'getUsersPagination').mockImplementation( async () =>{
			return null;
		});
        try {
            let admins = await userService.getUsers({});
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('verify user', ()=>{
	test('verify user successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {verified: "Pending", username: "julianquino"};
		});
        await userService.verifyUser("julianquino", "Yes");
        expect(1).toEqual(1);
    });

    test('Do not verify user', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {verified: "Pending", username: "julianquino"};
		});
        await userService.verifyUser("julianquino", "No");
        expect(1).toEqual(1);
    });

    test('verify user fail, User not found', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await userService.verifyUser("julianquino", "Pending");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('verify user fail, wrong action', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {verified: "Pending", username: "julianquino"};
		});
        try {
            await userService.verifyUser("julianquino", "null");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('verify user fail, No pending verification request exists for the user', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {verified: "null", username: "julianquino"};
		});
        try {
            await userService.verifyUser("julianquino", "Yes");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('verify user fail, server', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await userService.verifyUser({});
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('Ask for verification', ()=>{
	test('Ask for verification successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {verified: "", username: "julianquino", isBlocked: false};
		});
        await userService.askForVerification("julianquino", "Yes");
        expect(1).toEqual(1);
    });

    test('Ask for verification fail, User not found', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await userService.askForVerification("julianquino", "Pending");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('Ask for verification fail, User blocked', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {verified: "", username: "julianquino", isBlocked: true};
		});
        try {
            await userService.askForVerification("julianquino", "Pending");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 401);
        }
    });

    test('Ask for verification fail, A request is currently in progress', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {verified: "Pending", username: "julianquino", isBlocked: false};
		});
        try {
            await userService.askForVerification("julianquino", "null");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('Ask for verification fail, The user profile has already been successfully verified', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {verified: "Yes", username: "julianquino"};
		});
        try {
            await userService.askForVerification("julianquino", "Yes");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('Ask for verification fail, server', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await userService.askForVerification({});
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('Get User', ()=>{
	test('Get User successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino"};
		});
        let user = await userService.getUser("julianquino");
        expect(1).toEqual(1);
    });

    test('Get User fail', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            let user = await userService.getUser("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});