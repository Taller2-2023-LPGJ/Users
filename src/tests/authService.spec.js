const userService = require('../services/userService');
const authService = require('../services/authService');
const Exception = require('../services/exception');
const authDatabase = require('../database/authDatabase');
const mail = require('../services/mail');

jest.mock('../database/authDatabase');
jest.mock('../services/mail');

describe('signUp', ()=>{
	test('signUp successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        await authService.signUp("julianquino", "julianquino@gmail.com", "Julianquino1");
        expect(1).toEqual(1);
    });

    test('signUp successfully, user exist', async () => {
        jest.spyOn(authDatabase, 'searchUser').mockImplementation( async () =>{
			return {"username": "julianquino", "email": "julianquino@gmail.com"};
		});
        await authService.signUp("julianquino", "julianquino@gmail.com", "Julianquino1");
        expect(1).toEqual(1);
    });

	test('signUp fail, Enter a valid username', async () => {
		jest.spyOn(authDatabase, 'searchUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.signUp("j", "julianquino@gmail.com", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signUp fail, Enter a valid email', async () => {
		jest.spyOn(authDatabase, 'searchUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.signUp("julianquino", "julianquino", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signUp fail, Enter a valid password', async () => {
		jest.spyOn(authDatabase, 'searchUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.signUp("julianquino", "julianquino@gmail.com", "pass");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('Search user fail server', async () => {
		jest.spyOn(authDatabase, 'createUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await authService.signUp("julianquino", "julianquino@gmail.com", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('signUpConfirm', ()=>{
	test('signUpConfirm successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {"username": "julianquino", "passkey": "123456"};
		});
        await authService.signUpConfirm("julianquino", "123456");
        expect(1).toEqual(1);
    });

	test('signUpConfirm fail, User not found', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.signUpConfirm("julianquino", "123456");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 400);
        }
    });

    test('signUpConfirm fail, Incorrect code', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {"username": "julianquino", "passkey": "111111"};
		});
        try {
            await authService.signUpConfirm("julianquino", "123456");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signUpConfirm fail, server', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {"username": "julianquino", "passkey": "123456"};
		});
        jest.spyOn(authDatabase, 'updateUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await authService.signUpConfirm("julianquino", "123456");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('deleteUser', ()=>{
	test('deleteUser fail', async () => {
        jest.spyOn(authDatabase, 'deleteUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await authService.deleteUser("julianquino", "123456");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('signIn', ()=>{
	test('signIn successfully', async () => {
        jest.spyOn(authDatabase, 'verifyUser').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: false};
		});
        let user = await authService.signIn("julianquino", "Julianquino1");
        expect(user.username).toEqual("julianquino");
    });

	test('signIn fail, Enter a valid username or email', async () => {
        try {
            await authService.signIn("j", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signIn fail, Enter a valid password', async () => {
        try {
            await authService.signIn("julianquino", "pass");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signIn fail, Invalid username or password', async () => {
		jest.spyOn(authDatabase, 'verifyUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.signIn("julianquino", "pass");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signIn fail, User blocked', async () => {
		jest.spyOn(authDatabase, 'verifyUser').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: true};
		});
        try {
            await authService.signIn("julianquino", "pass");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signIn fail, server', async () => {
		jest.spyOn(authDatabase, 'verifyUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await authService.signIn("julianquino", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('signInGoogle', ()=>{
	test('signInGoogle successfully', async () => {
        jest.spyOn(authDatabase, 'verifyUserGoogle').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: false};
		});
        let username = await authService.signInGoogle("julianquino@gmail.com");
        expect(username).toEqual("julianquino");
    });

	test('signInGoogle fail, Enter a valid username or email', async () => {
        try {
            await authService.signInGoogle("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signInGoogle fail, User not found', async () => {
        jest.spyOn(authDatabase, 'verifyUserGoogle').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.signInGoogle("julianquino@gmail.com");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signInGoogle fail, User blocked', async () => {
		jest.spyOn(authDatabase, 'verifyUserGoogle').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: true};
		});
        try {
            await authService.signInGoogle("julianquino@gmail.com");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 401);
        }
    });
});

describe('recoverPassword', ()=>{
	test('recoverPassword successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: false};
		});
        let username = await authService.recoverPassword("julianquino");
        expect(1).toEqual(1);
    });

	test('recoverPassword fail, User not found', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.recoverPassword("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });
});

describe('verifyCodeRecoverPassword', ()=>{
	test('verifyCodeRecoverPassword successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
            let date = new Date();
            date.setDate(date.getDate() + 1);
			return {username: "julianquino", code: "123456", reset_expireby: date, passkey: "123456"};
		});
        let result = await authService.verifyCodeRecoverPassword("julianquino", "123456");
        expect(result).toEqual(true);
    });

	test('verifyCodeRecoverPassword fail, User not found', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.verifyCodeRecoverPassword("julianquino", "123456");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('verifyCodeRecoverPassword fail, The code expired, generate another one again', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			let date = new Date();
            date.setDate(date.getDate() - 1);
			return {username: "julianquino", code: "123456", reset_expireby: date, passkey: "123456"};
		});
        try {
            await authService.verifyCodeRecoverPassword("julianquino", "123456");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('verifyCodeRecoverPassword fail, Incorrect code', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			let date = new Date();
            date.setDate(date.getDate() + 1);
			return {username: "julianquino", code: "123456", reset_expireby: date, passkey: "111111"};
		});
        try {
            await authService.verifyCodeRecoverPassword("julianquino", "123456");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });
});
