const tokenController = require('../controllers/tokenController');

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

describe('update token', ()=>{
	test('update token successfully', async () => {
        
		let body = {
			"username": "julianquino"
		};
        tokenController.refreshToken({ body: body }, res);
        expect(res.statusCode).toEqual(200);
    });
});
