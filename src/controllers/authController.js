const nodemailer = require("nodemailer");
const authService = require('../services/authService');
const { sessionToken } = require('../services/tokenService');

const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    try{
		await authService.signUp(username, email, password);

        res.status(200).json({token: sessionToken(username)});
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const signIn = async (req, res) => {
    const {userIdentifier, password} = req.body;

    try{
		await authService.signIn(userIdentifier, password);
        
        res.status(200).json({token: sessionToken(userIdentifier)});
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const recoverPassword = async (req, res) => {
    const {username} = req.body;
    try{
		await authService.recoverPassword(username);
        
        res.status(200).json('send mail');
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const verifyCodeRecoverPassword = async (req, res) => {
    const {username} = req.body;
    const {code} = req.body;
    try{
		await authService.verifyCodeRecoverPassword(username, code);
        
        res.status(200).json('verified');
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const setPassword = async (req, res) => {
    const {username} = req.body;
    const {code} = req.body;
    const {password} = req.body;
    try{
		await authService.setPassword(username, code, password);
        
        res.status(200).json('Password reset');
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

module.exports = {
    signUp,
	signIn,
    recoverPassword,
    verifyCodeRecoverPassword,
    setPassword
}
