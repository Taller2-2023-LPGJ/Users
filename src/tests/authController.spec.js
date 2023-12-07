const authService = require('../services/authService');
const userService = require('../services/userService');
const Exception = require('../services/exception');
const authController = require('../controllers/authController');
const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');
jest.mock('../services/authService');
jest.mock('../services/userService');
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

describe('User signUp', ()=>{
	test('User manager registration successfully', async () => {
		let body = {
			"username": "admin4",
			"email": "admin4@gmail.com",
			"password": "Julianquino1"

		};
        await authController.signUp({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('User manager registration fail', async () => {
		jest.spyOn(authService, 'signUp').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"username": "admin4",
			"email": "admin4@gmail.com",
			"password": "Julianquino1"

		};
        await authController.signUp({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('User Register Confirm', ()=>{
	test('User Register Confirm successfully', async () => {
        jest.spyOn(userService, 'getUser').mockImplementation( async () =>{
			return {username: "julianquino", creationDate: new Date()};
		});
        jest.spyOn(axios, 'post').mockImplementation( async () =>{
			return {status: 200, data: {message : ""}};
		});
		let body = {
			"username": "admin4",
			"code": "123456"
		};
        await authController.signUpConfirm({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('User Register Confirm fail, profile', async () => {
		jest.spyOn(axios, 'post').mockImplementation( async () =>{
			return {status: 404, data: {message : ""}};
		});

		let body = {
			"username": "admin4",
			"code": "123456"
		};
        await authController.signUpConfirm({ body: body }, res);
        expect(res.statusCode).toEqual(404);
    });

    test('User Register Confirm fail, server', async () => {
		jest.spyOn(authService, 'signUpConfirm').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"username": "admin4",
			"code": "123456"
		};
        await authController.signUpConfirm({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('User signIn', ()=>{
	test('User login successfully', async () => {
		jest.spyOn(authService, 'signIn').mockImplementation( async () =>{
			return {
				username: "julianquino"
			}
		});
		let body = {
			"email": "admin4@gmail.com",
			"password": "Julianquino1"

		};
        await authController.signIn({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('User login fail', async () => {
		jest.spyOn(authService, 'signIn').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"username": "admin4",
			"email": "admin4@gmail.com",
			"password": "Julianquino1"

		};
        await authController.signIn({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('Register google', ()=>{
	test('Register google successfully', async () => {
        jest.spyOn(authService, 'signUpGoogle').mockImplementation( async () =>{
			return {username: "julianquino", creationDate: new Date()};
		});
        jest.spyOn(axios, 'post').mockImplementation( async () =>{
			return {status: 200, data: {message : ""}};
		});
		let body = {
			"name": "julianquino",
			"email": "julianquino@gmail.com"
		};
        await authController.signUpGoogle({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('Register google fail, profile', async () => {
        jest.spyOn(authService, 'signUpGoogle').mockImplementation( async () =>{
			return {username: "julianquino", creationDate: new Date()};
		});
		jest.spyOn(axios, 'post').mockImplementation( async () =>{
			return {status: 404, data: {message : ""}};
		});

		let body = {
			"name": "julianquino",
			"email": "julianquino@gmail.com"
		};
        await authController.signUpGoogle({ body: body }, res);
        expect(res.statusCode).toEqual(404);
    });

    test('Register google fail, server', async () => {
		jest.spyOn(authService, 'signUpGoogle').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"name": "julianquino",
			"email": "julianquino@gmail.com"
		};
        await authController.signUpGoogle({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('login to google', ()=>{
	test('login to google successfully', async () => {
		jest.spyOn(authService, 'signInGoogle').mockImplementation( async () =>{
			return "julianquino";
		});
		let body = {
			"email": "julianquino@gmail.com"
		};
        await authController.signInGoogle({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('login to google fail', async () => {
		jest.spyOn(authService, 'signInGoogle').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"email": "admin4@gmail.com"
		};
        await authController.signInGoogle({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('recover password', ()=>{
	test('recover password successfully', async () => {
		let body = {
			"username": "julianquino"
		};
        await authController.recoverPassword({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('recover password fail', async () => {
		jest.spyOn(authService, 'recoverPassword').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"username": "julianquino"
		};
        await authController.recoverPassword({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('verify code recover password', ()=>{
	test('recover password successfully', async () => {
		let body = {
			"username": "julianquino",
            "code": "123456"
		};
        await authController.verifyCodeRecoverPassword({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('recover password fail', async () => {
		jest.spyOn(authService, 'verifyCodeRecoverPassword').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"username": "julianquino",
            "code": "123456"
		};
        await authController.verifyCodeRecoverPassword({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('save password', ()=>{
	test('save password successfully', async () => {
        jest.spyOn(userService, 'getUser').mockImplementation( async () =>{
			return {
				username: "julianquino",
                recoverPasswordDate: new Date()
			}
		});
		let body = {
			"username": "julianquino",
            "code": "123456",
            "password": "pass"
		};
        await authController.setPassword({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('save password fail', async () => {
		jest.spyOn(authService, 'setPassword').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"username": "julianquino",
            "code": "123456",
            "password": "pass"
		};
        await authController.setPassword({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('verificar autenticación', ()=>{
	test('verificar autenticación successfully', async () => {
        await authController.verifyAuth({}, res);
        expect(res.statusCode).toEqual(200);
    });
});

describe('is Admin', ()=>{
	test('is Admin', async () => {
        jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
        jest.spyOn(jwt, 'verify').mockImplementation( async () =>{
			return {
				username: "julianquino"
			}
		});
		let headers = { token : "token"};
        let isAdmin = await authController.isAdmin({ headers: headers}, res);
        expect(res.statusCode).toEqual(200);
    });

	test('is Admin fail', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
        jest.spyOn(jwt, 'verify').mockImplementation( async () =>{
			return {
				username: "julianquino"
			}
		});
		let headers = { token : "token"};
        await authController.isAdmin({ headers: headers }, res);
        expect(res.statusCode).toEqual(500);
    });
});