const mail = require('../services/mail');
const mailer  = require('../config/mailer');

jest.mock("../config/mailer");

describe('mail', ()=>{
	test('mail successfully', async () => {
        let result = await mail.sendMailCode("Confirm Registration", "julianquino@gmail.com", "", 123456);
        expect(result).toEqual(undefined);
    });
});
