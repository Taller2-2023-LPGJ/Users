const bcrypt = require('bcrypt');

const authDatabase = require('../database/authDatabase');

const bcryptRounds = 10;
const usernameRegex = /^[a-zA-Z0-9_]{4,15}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,32}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

function ecryptPassword(password){
	bcrypt.hash(password, bcryptRounds, (err, hash) => {
		if (err) {
			throw err;
		}
		
		return hash;
	  })
}

async function signUp(username, email, password){
	if(!usernameRegex.test(username)){
		throw new Error('Enter a valid username.');
	} else if(!emailRegex.test(email)){
		throw new Error('Enter a valid email.');
	} else if(!passwordRegex.test(password)){
		throw new Error('Enter a valid password.');
	}
	
	try{
		password = ecryptPassword(password);

		await authDatabase.createUser(username, email, password);
	} catch(err){
		throw err;
	}
	//Devolver token
}

async function signIn(userIdentifier, password){
	if(!usernameRegex.test(userIdentifier) && !emailRegex.test(userIdentifier)){
		throw new Error('Enter a valid username or email.');
	} else if(!passwordRegex.test(password)){
		throw new Error('Enter a valid password.');
	}

	if(!(await authDatabase.verifyUser(userIdentifier, password))) {
		throw new Error('Invalid username or password.');
	}

	return '123456';
}

module.exports = {
  	signUp,
  	signIn
};
