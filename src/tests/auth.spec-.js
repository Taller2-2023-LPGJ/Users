const request = require('supertest');

const axios = require('axios');

const app = require('../../server');

const database = require('../database/authDatabase');

jest.mock('../database/authDatabase');
jest.mock('../services/mail');
jest.mock("axios");

describe('User creation', ()=>{
  it('User creation correctly', async ()=>{
    var user = {
      "username": "julianquino",
      "email": "julian.quino2@gmail.com",
      "password": "Julianquino1"
    }
    await request(app)
      .post('/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect(200);
  })

  it('The user was not created because the username is invalid.', async ()=>{
    var user = {
      "username": "j",
      "email": "julian.quino2@gmail.com",
      "password": "Julianquino1"
    }
    await request(app)
      .post('/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect(422);
  })

  it('The user was not created because the email is not valid.', async ()=>{
    var user = {
      "username": "julianquino",
      "email": "julian.quino",
      "password": "Julianquino1"
    }
    await request(app)
      .post('/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect(422);
  })

  it('The user was not created because the password is invalid', async ()=>{
    var user = {
      "username": "julianquino",
      "email": "julian.quino2@gmail.com",
      "password": "julianquino"
    }
    await request(app)
      .post('/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect(422);
  })

  it('user was not created due to missing username', async ()=>{
    var user = {
      "email": "julian.quino2@gmail.com",
      "password": "Julianquino1"
    }
    await request(app)
      .post('/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect(422);
  })

  it('The user was not created because there was no email address', async ()=>{
    var user = {
      "username": "julianquino",
      "password": "Julianquino1"
    }
    await request(app)
      .post('/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect(422);
  })

  it('User was not created due to missing password', async ()=>{
    var user = {
      "username": "julianquino",
      "email": "julian.quino2@gmail.com"
    }
    await request(app)
      .post('/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect(422);
  })
});

describe('Confirm user creation', ()=>{
  it('Confirm user creation with valid code', async ()=>{
    var body = {
      "username": "julianquino",
      "code": 123456
    }

    jest.spyOn(database, 'getUser').mockImplementation( async () =>{
      return {
        username: 'julianquino',
        email: 'julian.quino2@gmail.com',
        password: 'password',
        confirmedRegistration: false,
        verified: false,
        passkey: 123456,
        isAdmin: false,
        isBlocked: false,
        reset_expireby: null
      }
    });

    jest.spyOn(axios, 'post').mockImplementation(() => {
      return {
        status: 200,
        data: {
          message: 'profile created'
        }
      }
    });

    await request(app)
      .post('/signupconfirm')
      .send(body)
      .set('Accept', 'application/json')
      .expect(200);
  })

  it('User creation was not confirmed because the code is invalid', async ()=>{
    var body = {
      "username": "julianquino",
      "code": 234567
    }

    jest.spyOn(database, 'getUser').mockImplementation( async () =>{
      return {
        username: 'julianquino',
        email: 'julian.quino2@gmail.com',
        password: 'password',
        confirmedRegistration: false,
        verified: false,
        passkey: 123456,
        isAdmin: false,
        isBlocked: false,
        reset_expireby: null
      }
    });

    await request(app)
      .post('/signupconfirm')
      .send(body)
      .set('Accept', 'application/json')
      .expect(422);
  })

  it('User creation was not confirmed because the user does not exist', async ()=>{
    var body = {
      "username": "julianquino",
      "code": 234567
    }

    jest.spyOn(database, 'getUser').mockImplementation( async () =>{
      return null
    });

    await request(app)
      .post('/signupconfirm')
      .send(body)
      .set('Accept', 'application/json')
      .expect(400);
  })
});

describe('Login user', ()=>{
  it('login user successfully', async ()=>{
    var body = {
      "userIdentifier": "julianquino",
      "password": "Julianquino1"
    }

    jest.spyOn(database, 'verifyUser').mockImplementation( async () =>{
      return {
        username: 'julianquino',
        email: 'julian.quino2@gmail.com',
        password: 'Julianquino1',
        confirmedRegistration: false,
        verified: false,
        passkey: 123456,
        isAdmin: false,
        isBlocked: false,
        reset_expireby: null
      }
    });

    await request(app)
      .post('/signin')
      .send(body)
      .set('Accept', 'application/json')
      .expect(200);
  })

  it('The user does not log in because the password is invalid or the user does not exist', async ()=>{
    var body = {
      "userIdentifier": "invalido",
      "password": "invalido"
    }

    jest.spyOn(database, 'verifyUser').mockImplementation( async () =>{
      return false
    });

    await request(app)
      .post('/signin')
      .send(body)
      .set('Accept', 'application/json')
      .expect(422);
  })

  it('The user does not log in because he is blocked', async ()=>{
    var body = {
      "userIdentifier": "julianquino",
      "password": "Julianquino1"
    }

    jest.spyOn(database, 'verifyUser').mockImplementation( async () =>{
      return {
        username: 'julianquino',
        email: 'julian.quino2@gmail.com',
        password: 'Julianquino1',
        confirmedRegistration: false,
        verified: false,
        passkey: 123456,
        isAdmin: false,
        isBlocked: true,
        reset_expireby: null
      }
    });

    await request(app)
      .post('/signin')
      .send(body)
      .set('Accept', 'application/json')
      .expect(403);
  })

  it('The user does not log in because the data entered is invalid', async ()=>{
    var body = {
      "userIdentifier": "j",
      "password": "Julianquino1"
    }

    await request(app)
      .post('/signin')
      .send(body)
      .set('Accept', 'application/json')
      .expect(422);
    
    var body = {
      "userIdentifier": "julianquino",
      "password": "julianquino"
    }

    await request(app)
      .post('/signin')
      .send(body)
      .set('Accept', 'application/json')
      .expect(422);
  })

});

describe('Creating user with google correctly', ()=>{
  it('login user successfully', async ()=>{
    var body = {
      "name": "julian quino",
      "email": "julian.quino2@gmail.com"
    }

    jest.spyOn(database, 'verifyUser').mockImplementation( async () =>{
      return {
        username: 'julianquino',
        email: 'julian.quino2@gmail.com',
        password: 'Julianquino1',
        confirmedRegistration: false,
        verified: false,
        passkey: 123456,
        isAdmin: false,
        isBlocked: false,
        reset_expireby: null
      }
    });

    jest.spyOn(axios, 'post').mockImplementation(() => {
      return {
        status: 200,
        data: {
          message: 'profile created'
        }
      }
    });

    await request(app)
      .post('/signin')
      .send(body)
      .set('Accept', 'application/json')
      .expect(200);
  })

  it('The user does not log in because the password is invalid or the user does not exist', async ()=>{
    var body = {
      "userIdentifier": "invalido",
      "password": "invalido"
    }

    jest.spyOn(database, 'verifyUser').mockImplementation( async () =>{
      return false
    });

    await request(app)
      .post('/signin')
      .send(body)
      .set('Accept', 'application/json')
      .expect(422);
  })

  it('The user does not log in because he is blocked', async ()=>{
    var body = {
      "userIdentifier": "julianquino",
      "password": "Julianquino1"
    }

    jest.spyOn(database, 'verifyUser').mockImplementation( async () =>{
      return {
        username: 'julianquino',
        email: 'julian.quino2@gmail.com',
        password: 'Julianquino1',
        confirmedRegistration: false,
        verified: false,
        passkey: 123456,
        isAdmin: false,
        isBlocked: true,
        reset_expireby: null
      }
    });

    await request(app)
      .post('/signin')
      .send(body)
      .set('Accept', 'application/json')
      .expect(403);
  })

  it('The user does not log in because the data entered is invalid', async ()=>{
    var body = {
      "userIdentifier": "j",
      "password": "Julianquino1"
    }

    await request(app)
      .post('/signin')
      .send(body)
      .set('Accept', 'application/json')
      .expect(422);
    
    var body = {
      "userIdentifier": "julianquino",
      "password": "julianquino"
    }

    await request(app)
      .post('/signin')
      .send(body)
      .set('Accept', 'application/json')
      .expect(422);
  })

});