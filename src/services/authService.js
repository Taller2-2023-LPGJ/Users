const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator')
const { transporter, bodyEmail }  = require('../config/mailer');
const authDatabase = require('../database/authDatabase');
const Exception = require('./exception');
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
	if(!usernameRegex.test(username))
		throw new Exception('Enter a valid username.', 422);
	else if(!emailRegex.test(email))
		throw new Exception('Enter a valid email.', 422);
	else if(!passwordRegex.test(password))
		throw new Exception('Enter a valid password.', 422);
	
	try{
		password = ecryptPassword(password);
		await authDatabase.createUser(username, email, password);
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

	const username = await authDatabase.verifyUser(userIdentifier, password);

	if(!username)
		throw new Exception('Invalid username or password.', 401);

	return username;
}

async function signUpGoogle(name, email){
	name = name.replace(' ', '_');
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
		await authDatabase.createUser(name, email, password);
		var user = await authDatabase.getUser(name);
		return user;
	} catch(err){
		throw err;
	}
}

async function signInGoogle(email){
	if(!emailRegex.test(email))
		throw new Exception('Enter a valid username or email.', 422);

	const username = await authDatabase.verifyUserGoogle(email);

	if(!username)
		throw new Exception('User not found.', 401);

	return username;
}

async function recoverPassword(username){
	var user = await authDatabase.getUser(username);
	if(!user){
		throw new Exception('User not found.', 401);
	}
	let code = otpGenerator.generate(numberOfDigits, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
	
	user.reset_passkey = code;
	user.reset_expireby = new Date(new Date().getTime() + 3 * 60000);
	await authDatabase.updateUser(user);
	var body = bodyEmail(user.username, code);
	await transporter.sendMail({
		from: '"Password recovery" <notificacionesservidoremail@gmail.com>',
		to: user.email,
		subject: "Password recovery",
		html: body,
	});
}

async function verifyCodeRecoverPassword(username, code){
	var user = await authDatabase.getUser(username);
	if(!user){
		throw new Exception('User not found.', 401);
	}
	let reset_expireby = new Date(user.reset_expireby);
	let dateNow = new Date();
	if(reset_expireby < dateNow){
		throw new Exception('The code expired, generate another one again.', 422);
	}
	if(user.reset_passkey !== code){
		throw new Exception('Incorrect code.', 422);
	}
	return true;
}

async function setPassword(username, code, password){
	if(!passwordRegex.test(password))
		throw new Exception('Enter a valid password.', 422);
	var user = await authDatabase.getUser(username);
	if(!user){
		throw new Exception('User not found.', 401);
	}
	await verifyCodeRecoverPassword(username, code);
	user.password = ecryptPassword(password);
	user.reset_passkey = null;
	user.reset_expireby = null;
	await authDatabase.updateUser(user);
}

module.exports = {
  	signUp,
	deleteUser,
  	signIn,
	signUpGoogle,
	signInGoogle,
	recoverPassword,
	verifyCodeRecoverPassword,
	setPassword
};