const bcrypt = require('bcrypt');

const authDatabase = require('../database/authDatabase');

const BCRYPT_ROUNDS = 10;

function ecryptPassword(password){
	bcrypt.hash(password, BCRYPT_ROUNDS, (err, hash) => {
		if (err) {
			throw err;
		}
		
		return hash;
	  })
}

async function signUp(username, email, password){
	if(!username){
		throw new Error('Enter a valid username.');
	} else if(!email){
		throw new Error('Enter an email.');
	} else if(!password){
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
	console.log(userIdentifier);
	if(!userIdentifier){
		throw new Error('Enter a valid username or email.');
	} else if(!password){
		throw new Error('Enter a valid password.');
	}

	if(!(await authDatabase.verifyUser(userIdentifier, password))) {
		throw new Error('Invalid username or password.');
	}

	//Devolver token
	return '123456';
}

module.exports = {
  	signUp,
  	signIn
};
