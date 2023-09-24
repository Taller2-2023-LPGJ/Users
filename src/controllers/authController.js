const nodemailer = require("nodemailer");
const axios = require('axios');
const fetch = require('node-fetch');
const authService = require('../services/authService');
const { sessionToken } = require('../services/tokenService');

const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    try{
		await authService.signUp(username, email, password);

        const profileRes = await axios.post(process.env.PROFILE_URL, {username: username});

        if(profileRes.status !== 200){
            authService.deleteUser(username);
            res.status(profileRes.status).json({token: sessionToken(username)});
        } else{
            res.status(200).json({token: sessionToken(username)});
        }
	} catch(err){
        console.log(err);
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const signIn = async (req, res) => {
    const {userIdentifier, password} = req.body;

    try{
		const username = await authService.signIn(userIdentifier, password);
        
        res.status(200).json({token: sessionToken(username)});
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
    const {username, code} = req.body;

    try{
		await authService.verifyCodeRecoverPassword(username, code);
        
        res.status(200).json('Recovery code has been successfully verified.');
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const setPassword = async (req, res) => {
    const {username, code, password} = req.body;
    
    try{
		await authService.setPassword(username, code, password);
        
        res.status(200).json('Password has been succesfully reset.');
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
