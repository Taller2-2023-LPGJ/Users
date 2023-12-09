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
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", email: "julianquino@gmail.com", confirmedRegistration: false};
		});
        await authService.signUp("julianquino", "julianquino@gmail.com", "Julianquino1");
        expect(1).toEqual(1);
    });

	test('signUp fail, Enter a valid username', async () => {
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
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
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
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
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
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
		jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
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
            await authService.signIn("julianquino", "Julianquino1");
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
            await authService.signIn("julianquino", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 403);
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
        await authService.recoverPassword("julianquino");
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

describe('setPassword', ()=>{
	test('setPassword successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
            let date = new Date();
            date.setDate(date.getDate() + 1);
			return {username: "julianquino", code: "123456", reset_expireby: date, passkey: "123456"};
		});
        let result = await authService.setPassword("julianquino", "123456", "Julianquino1");
        expect(result).toEqual(undefined);
    });

	test('setPassword fail, Enter a valid password', async () => {
        try {
            await authService.setPassword("julianquino", "123456", "pass");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('setPassword fail, User not found', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.setPassword("julianquino", "123456", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });
});

describe('signUpAdmin', ()=>{
	test('signUpAdmin successfully', async () => {
        let result = await authService.signUpAdmin("julianquino", "julianquino@gmail.com", "Julianquino1");
        expect(result).toEqual(undefined);
    });

	test('signUpAdmin fail, Enter a valid username', async () => {
        try {
            await authService.signUpAdmin("j", "julianquino@gmail.com", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signUpAdmin fail, Enter a valid email', async () => {
        try {
            await authService.signUpAdmin("julianquino", "julianquino", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signUpAdmin fail, Enter a valid password', async () => {
        try {
            await authService.signUpAdmin("julianquino", "julianquino@gmail.com", "pass");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signUpAdmin fail, server', async () => {
        jest.spyOn(authDatabase, 'createUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await authService.signUpAdmin("julianquino", "julianquino@gmail.com", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('signInAdmin', ()=>{
	test('signInAdmin successfully', async () => {
        jest.spyOn(authDatabase, 'verifyUser').mockImplementation( async () =>{
			return {username: "julianquino"};
		});
        let result = await authService.signInAdmin("julianquino@gmail.com", "Julianquino1");
        expect(result.username).toEqual("julianquino");
    });

	test('signInAdmin fail, Enter a valid email', async () => {
        try {
            await authService.signInAdmin("julianquino", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signInAdmin fail, Enter a valid password', async () => {
        try {
            await authService.signInAdmin("julianquino@gmail.com", "pass");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signInAdmin fail, Invalid email or password', async () => {
        jest.spyOn(authDatabase, 'verifyUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.signInAdmin("julianquino@gmail.com", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signInAdmin fail, server', async () => {
        jest.spyOn(authDatabase, 'verifyUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await authService.signInAdmin("julianquino@gmail.com", "Julianquino1");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('verifyAuthUser', ()=>{
	test('verifyAuthUser successfully', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: false};
		});
        let result = await authService.verifyAuthUser("julianquino");
        expect(result.username).toEqual("julianquino");
    });

	test('verifyAuthUser fail, User not found', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.verifyAuthUser("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 401);
        }
    });

    test('verifyAuthUser fail, User blocked', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", isBlocked: true};
		});
        try {
            await authService.verifyAuthUser("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 401);
        }
    });

    test('verifyAuthUser fail, server', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await authService.verifyAuthUser("julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});

describe('signUpGoogle', ()=>{
	test('signUpGoogle successfully', async () => {
        let user = null;
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return user;
		});
        jest.spyOn(authDatabase, 'createUser').mockImplementation( async () =>{
			user = {username: "julianquino"};
		});
        let result = await authService.signUpGoogle("julianquino", "julianquino@gmail.com");
        expect(result.username).toEqual("julianquino");
    });

	test('signUpGoogle fail, Enter a valid email', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        try {
            await authService.signUpGoogle("julianquino", "julianquino");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 422);
        }
    });

    test('signUpGoogle fail, server', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await authService.signUpGoogle("julianquino", "julianquino@gmail.com");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });

    test('signUpGoogle fail, server', async () => {
        jest.spyOn(authDatabase, 'getUser').mockImplementation( async () =>{
			return null;
		});
        jest.spyOn(authDatabase, 'createUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        try {
            await authService.signUpGoogle("julianquino", "julianquino@gmail.com");
        } catch (error) {
            expect(error).toBeInstanceOf(Exception);
            expect(error).toHaveProperty('statusCode', 500);
        }
    });
});