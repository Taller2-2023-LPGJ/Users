const { Request, Response } = require('express');
const authService = require('../services/authService');
const adminController = require('../controllers/adminController');
const userService = require('../services/userService');
const Exception = require('../services/exception');

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

describe('User admin signUp', ()=>{
	test('User manager registration successfully', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
		let body = {
			"username": "admin4",
			"email": "admin4@gmail.com",
			"password": "Julianquino1"
		};
        await adminController.signUp({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('User manager registration fail, no admin', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return false;
		});
		let body = {
			"username": "admin4",
			"email": "admin4@gmail.com",
			"password": "Julianquino1"
		};
        await adminController.signUp({ body: body }, res);
        expect(res.statusCode).toEqual(403);
    });

	test('User manager registration fail', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
		jest.spyOn(authService, 'signUpAdmin').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"username": "admin4",
			"email": "admin4@gmail.com",
			"password": "Julianquino1"
		};
        await adminController.signUp({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('User admin signIn', ()=>{
	test('User manager login successfully', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true
		});
		jest.spyOn(authService, 'signInAdmin').mockImplementation( async () =>{
			return {
				username: "julianquino"
			}
		});
		let body = {
			"email": "admin4@gmail.com",
			"password": "Julianquino1"

		};
        await adminController.signIn({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('User manager login fail, no admin', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return false;
		});
		jest.spyOn(authService, 'signInAdmin').mockImplementation( async () =>{
			return {
				username: "julianquino"
			}
		});

		let body = {
			"username": "admin4",
			"email": "admin4@gmail.com",
			"password": "Julianquino1"

		};
        await adminController.signIn({ body: body }, res);
        expect(res.statusCode).toEqual(403);
    });

	test('User manager login fail, server', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true
		});
		jest.spyOn(authService, 'signInAdmin').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"username": "admin4",
			"email": "admin4@gmail.com",
			"password": "Julianquino1"

		};
        await adminController.signIn({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('The administrator user blocks another user', ()=>{
	test('The administrator user blocks another user successfully', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
		let body = {
			"username": "julianquino"
		};
        await adminController.blockUser({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('The administrator user blocks another user fail, no admin', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return false;
		});

		let body = {
			"username": "julianquino"
		};
        await adminController.blockUser({ body: body }, res);
        expect(res.statusCode).toEqual(403);
    });

	test('The administrator user blocks another user fail', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
		jest.spyOn(userService, 'blockUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let body = {
			"username": "julianquino"
		};
        await adminController.blockUser({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('The administrator user unlocks another user', ()=>{
	test('The administrator user unlocks another user successfully', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
		jest.spyOn(userService, 'getUser').mockImplementation( async () =>{
			return {
				blockDate: new Date()
			}
		});
		let body = {
			"username": "julianquino"
		};
        await adminController.unlockUser({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('The administrator user unlocks another user fail, no admin', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return false;
		});
		let body = {
			"username": "julianquino"
		};
        await adminController.unlockUser({ body: body }, res);
        expect(res.statusCode).toEqual(403);
    });

	test('The administrator user unlocks another user fail', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
		jest.spyOn(userService, 'unlockUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
		let body = {
			"username": "julianquino"
		};
        await adminController.unlockUser({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('Get administrators', ()=>{
	test('Get administrators successfully', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
		jest.spyOn(userService, 'getAdmins').mockImplementation( async () =>{
			return []
		});
		let query = {
			"username": "julianquino"
		};
        await adminController.getAdmins({ query: query }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('Get administrators fail, no admin', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return false;
		});
		let query = {
			"username": "julianquino"
		};
        await adminController.getAdmins({ query: query }, res);
        expect(res.statusCode).toEqual(403);
    });

	test('Get administrators fail', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
		jest.spyOn(userService, 'getAdmins').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
		let query = {
			"username": "julianquino"
		};
        await adminController.getAdmins({ query: query }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('verify user', ()=>{
	test('verify user successfully', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
		let body = {
			"username": "julianquino",
			"action": "Yes"
		};
        await adminController.verifyUser({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('verify user fail, no admin', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return false;
		});
		let body = {
			"username": "julianquino",
			"action": "Yes"
		};
        await adminController.verifyUser({ body: body }, res);
        expect(res.statusCode).toEqual(403);
    });

	test('verify user fail', async () => {
		jest.spyOn(userService, 'isAdmin').mockImplementation( async () =>{
			return true;
		});
		jest.spyOn(userService, 'verifyUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
		let body = {
			"username": "julianquino",
			"action": "Yes"
		};
        await adminController.verifyUser({ body: body }, res);
        expect(res.statusCode).toEqual(500);
    });
});