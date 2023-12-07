const userController = require('../controllers/userController');
const userService = require('../services/userService');
const Exception = require('../services/exception');
const jwt = require('jsonwebtoken');

jest.mock('../services/userService');
jest.mock('jsonwebtoken');
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
        jest.spyOn(userService, 'searchUser').mockImplementation( async () =>{
			return {
                "username": "julianquino"
            }
		});
		let query = {
			"username": "julianquino"
		};
        await userController.searchUser({ query: query }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('Search user fail', async () => {
		jest.spyOn(userService, 'searchUser').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let query = {
			"username": "julianquino"
		};
        await userController.searchUser({ query: query }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('get users', ()=>{
	test('Get users successfully', async () => {
        jest.spyOn(userService, 'getUsers').mockImplementation( async () =>{
			return []
		});
		let query = {
			"username": "julianquino"
		};
        await userController.getUsers({ query: query }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('Get users fail', async () => {
		jest.spyOn(userService, 'getUsers').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});

		let query = {
			"username": "julianquino"
		};
        await userController.getUsers({ query: query }, res);
        expect(res.statusCode).toEqual(500);
    });
});

describe('Ask for verification', ()=>{
	test('Ask for verification successfully', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation( async () =>{
			return {
                username: "julianquino"
            }
		});
		let headers = {
			token: "mitoken"
		};
        await userController.askForVerification({ headers: headers }, res);
        expect(res.statusCode).toEqual(200);
    });

	test('Ask for verification fail server', async () => {
		jest.spyOn(jwt, 'verify').mockImplementation( async () =>{
			return {
                username: "julianquino"
            }
		});
        jest.spyOn(userService, 'askForVerification').mockImplementation( async () =>{
			throw new Exception('fail', 500);
		});
		let headers = {
			token: "mitoken"
		};
        await userController.askForVerification({ headers: headers }, res);
        expect(res.statusCode).toEqual(500);
    });
});