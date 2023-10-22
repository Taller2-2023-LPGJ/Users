const nodemailer = require("nodemailer");
const axios = require('axios');
const authService = require('../services/authService');
const { sessionToken } = require('../services/tokenService');
const userService = require('../services/userService');

const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    try{
		await authService.signUpAdmin(username, email, password);

        res.status(200).json('Admin created.');
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const signIn = async (req, res) => {
    const {email, password} = req.body;

    try{
		const user = await authService.signInAdmin(email, password);
        
        res.status(200).json({token: sessionToken(user.username)});
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const blockUser = async (req, res) => {
    const {username} = req.body;

    try{
		await userService.blockUser(username);
        
        res.status(200).json('user blocked.');
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const unlockUser = async (req, res) => {
    const {username} = req.body;

    try{
		await userService.unlockUser(username);
        
        res.status(200).json('Unlocked user.');
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const getAdmins = async (req, res) => {
    const query = req.query;

    try{
		let admins = await userService.getAdmins(query);
        res.status(200).json(admins);
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const verifyUser = async (req, res) => {
    const {username, action} = req.body;

    try{
		await userService.verifyUser(username, action);
        if(action === "Yes"){
			await axios.put(process.env.PROFILE_URL + "verifyProfile/" + username, {username: username});
		}
        res.status(200).json('Action completed.');
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

module.exports = {
    signUp,
	signIn,
    blockUser,
    unlockUser,
    getAdmins,
    verifyUser
}
