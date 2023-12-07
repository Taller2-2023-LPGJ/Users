const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator')
const { transporter, bodyEmailRecoverPassword, bodyEmailConfirmRegistration }  = require('../config/mailer');
const authDatabase = require('../database/authDatabase');
const Exception = require('./exception');
const mail = require('./mail');
const { error } = require('console');

const bcryptRounds = 10;
const numberOfDigits = 6;
const usernameRegex = /^[a-zA-Z0-9_]{4,15}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,32}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

function ecryptPassword(password){
	var hash = bcrypt.hashSync(password, bcryptRounds);
	return hash;
}

async function signUp(username, email, password){
	if(!usernameRegex.test(username) || !username)
		throw new Exception('Enter a valid username.', 422);
	else if(!emailRegex.test(email))
		throw new Exception('Enter a valid email.', 422);
	else if(!passwordRegex.test(password))
		throw new Exception('Enter a valid password.', 422);
	
	try{
		let user = await authDatabase.getUser(username);
		if(user){
			if (!user.confirmedRegistration) {
				await authDatabase.deleteUser(username);
			}
		}
		let code = otpGenerator.generate(numberOfDigits, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
		password = ecryptPassword(password);
		await authDatabase.createUser(username, email, password, false, code, false);
		var body = bodyEmailConfirmRegistration(username, code);
		await mail.sendMailCode('Confirm Registration', email, body, code);
	} catch(err){
		throw err;
	}
}

async function signUpConfirm(username, code){
	try{
		var user = await authDatabase.getUser(username);
		if(!user){
			throw new Exception('User not found.', 400);
		}
		if(user.passkey !== code){
			throw new Exception('Incorrect code.', 422);
		}
		user.passkey = null;
		user.confirmedRegistration = true;
		await authDatabase.updateUser(user);
	} catch(err){
		throw err;
	}
}

async function deleteUser(username){
	try{
		await authDatabase.deleteUser(username);
	} catch(err){
		throw err;
	}
}

async function signIn(userIdentifier, password){
	if(!usernameRegex.test(userIdentifier) && !emailRegex.test(userIdentifier))
		throw new Exception('Enter a valid username or email.', 422);
	else if(!passwordRegex.test(password))
		throw new Exception('Enter a valid password.', 422);

	const user = await authDatabase.verifyUser(userIdentifier, password, false);

	if(!user)
		throw new Exception('Invalid username or password.', 422);
	if(user.isBlocked)
		throw new Exception('User blocked.', 403);

	return user;
}

async function signUpGoogle(name, email){
	name = name.replaceAll(' ', '_');
	var num = 0;
	var user = await authDatabase.getUser(name);
	while ( user!==null ) {
		num++;
		name = name + num;
		user = await authDatabase.getUser(name);
	}
	if(!emailRegex.test(email))
		throw new Exception('Enter a valid email.', 422);
	
	try{
		var code = otpGenerator.generate(10, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: false });
		var password = ecryptPassword(code);
		await authDatabase.createUser(name, email, password, true, null, false);
		var user = await authDatabase.getUser(name);
		return user;
	} catch(err){
		throw err;
	}
}

async function signInGoogle(email){
	if(!emailRegex.test(email))
		throw new Exception('Enter a valid username or email.', 422);

	const user = await authDatabase.verifyUserGoogle(email);
	if(!user)
		throw new Exception('User not found.', 422);
	if(user.isBlocked)
		throw new Exception('User blocked.', 401);

	return user.username;
}

async function recoverPassword(username){
	var user = await authDatabase.getUser(username);
	if(!user){
		throw new Exception('User not found.', 422);
	}
	let code = otpGenerator.generate(numberOfDigits, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
	
	user.passkey = code;
	user.recoverPasswordDate = new Date();
	user.reset_expireby = new Date(new Date().getTime() + 3 * 60000);
	await authDatabase.updateUser(user);
	var body = bodyEmailRecoverPassword(username, code);
	await mail.sendMailCode('Password recovery', user.email, body);
}

async function verifyCodeRecoverPassword(username, code){
	var user = await authDatabase.getUser(username);
	if(!user){
		throw new Exception('User not found.', 422);
	}
	let reset_expireby = new Date(user.reset_expireby);
	let dateNow = new Date();
	if(reset_expireby < dateNow){
		throw new Exception('The code expired, generate another one again.', 422);
	}
	if(user.passkey !== code){
		throw new Exception('Incorrect code.', 422);
	}
	return true;
}

async function setPassword(username, code, password){
	if(!passwordRegex.test(password))
		throw new Exception('Enter a valid password.', 422);
	var user = await authDatabase.getUser(username);
	if(!user){
		throw new Exception('User not found.', 422);
	}
	await verifyCodeRecoverPassword(username, code);
	user.password = ecryptPassword(password);
	user.passkey = null;
	user.reset_expireby = null;
	await authDatabase.updateUser(user);
}

async function signUpAdmin(username, email, password){
	if(!usernameRegex.test(username))
		throw new Exception('Enter a valid username.', 422);
	else if(!emailRegex.test(email))
		throw new Exception('Enter a valid email.', 422);
	else if(!passwordRegex.test(password))
		throw new Exception('Enter a valid password.', 422);
	
	try{
		password = ecryptPassword(password);
		await authDatabase.createUser(username, email, password, true, null, true);
	} catch(err){
		throw err;
	}
}

async function signInAdmin(email, password){
	if(!emailRegex.test(email))
		throw new Exception('Enter a valid email.', 422);
	else if(!passwordRegex.test(password))
		throw new Exception('Enter a valid password.', 422);

	const user = await authDatabase.verifyUser(email, password, true);

	if(!user)
		throw new Exception('Invalid email or password.', 422);

	return user;
}

async function verifyAuthUser(username){
	let user = await authDatabase.getUser(username);
	if(!user){
		throw new Exception('User not found.', 401);
	}
	if(user.isBlocked){
		throw new Exception('User blocked.', 401);
	}
	return user;
}

module.exports = {
  	signUp,
	signUpConfirm,
	deleteUser,
  	signIn,
	signUpGoogle,
	signInGoogle,
	recoverPassword,
	verifyCodeRecoverPassword,
	setPassword,
	signUpAdmin,
	signInAdmin,
	verifyAuthUser
};