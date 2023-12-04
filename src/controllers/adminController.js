const axios = require('axios');
const authService = require('../services/authService');
const userService = require('../services/userService');
const { sessionToken } = require('../services/tokenService');

const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    try{
		await authService.signUpAdmin(username, email, password);

        res.status(200).json('Admin created.');
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const signIn = async (req, res) => {
    const {email, password} = req.body;

    try{
        if(!(await userService.isAdmin('', email)))
            throw new Exception('User is forbidden from completing this action.', 403);
		const user = await authService.signInAdmin(email, password);
        
        res.status(200).json({token: sessionToken(user.username)});
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const blockUser = async (req, res) => {
    const {username} = req.body;

    try{
        if(!(await userService.isAdmin(username)))
            throw new Exception('User is forbidden from completing this action.', 403);
		await userService.blockUser(username);
        
        res.status(200).json('User has been successfully blocked.');
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const unlockUser = async (req, res) => {
    const {username} = req.body;

    try{
        if(!(await userService.isAdmin(username)))
            throw new Exception('User is forbidden from completing this action.', 403);
		await userService.unlockUser(username);
        
        res.status(200).json('Unlocked user.');
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const getAdmins = async (req, res) => {
    const query = req.query;

    try{
        if(!(await userService.isAdmin(username)))
            throw new Exception('User is forbidden from completing this action.', 403);

		let admins = await userService.getAdmins(query);
        
        res.status(200).json(admins);
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const verifyUser = async (req, res) => {
    const {username, action} = req.body;

    try{
        if(!(await userService.isAdmin(username)))
            throw new Exception('User is forbidden from completing this action.', 403);

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
