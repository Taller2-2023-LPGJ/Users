const bcrypt = require('bcrypt');
const authDatabase = require('../database/authDatabase');
const Exception = require('./exception');

const bcryptRounds = 10;
const usernameRegex = /^[a-zA-Z0-9_]{4,15}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,32}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

function ecryptPassword(password){
	var hash = bcrypt.hashSync(password, bcryptRounds);
	return hash;
}

async function signUp(username, email, password){
	if(!usernameRegex.test(username)){
		throw new Exception('Enter a valid username.', 422);
	} else if(!emailRegex.test(email)){
		throw new Exception('Enter a valid email.', 422);
	} else if(!passwordRegex.test(password)){
		throw new Exception('Enter a valid password.', 422);
	}
	
	try{
		password = ecryptPassword(password);
		await authDatabase.createUser(username, email, password);
	} catch(err){
		throw err;
	}
}

async function signIn(userIdentifier, password){
	if(!usernameRegex.test(userIdentifier) && !emailRegex.test(userIdentifier)){
		throw new Exception('Enter a valid username or email.', 422);
	} else if(!passwordRegex.test(password)){
		throw new Exception('Enter a valid password.', 422);
	}

	if(!(await authDatabase.verifyUser(userIdentifier, password))) {
		throw new Exception('Invalid username or password.', 401);
	}
}

module.exports = {
  	signUp,
  	signIn
};
