const axios = require('axios');
const authService = require('../services/authService');
const userService = require('../services/userService');
const { sessionToken } = require('../services/tokenService');
const Exception = require('../services/exception');
const StatsD  = require('hot-shots');
const dogstatsd = new StatsD({
    host: process.env.DD_AGENT_HOST,
    globalTags: {
      env: process.env.NODE_ENV,
    },
    errorHandler: function (error) {
      console.error('Cannot connect to Datadog agent: ', error);
    }
});

const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    try{
		await authService.signUpAdmin(username, email, password);

        res.status(200).json({message: 'Admin created.'});
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
    const {username, user} = req.body;

    try{
        if(!(await userService.isAdmin(username)))
            throw new Exception('User is forbidden from completing this action.', 403);
		await userService.blockUser(user);
        
        res.status(200).json({message: 'User has been successfully blocked.'});
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const unlockUser = async (req, res) => {
    const {username, user} = req.body;

    try{
        if(!(await userService.isAdmin(username)))
            throw new Exception('User is forbidden from completing this action.', 403);
		await userService.unlockUser(user);
        
        res.status(200).json({message: 'Unlocked user.'});
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const getAdmins = async (req, res) => {
    const query = req.query;

    try{
        if(!(await userService.isAdmin(query.username)))
            throw new Exception('User is forbidden from completing this action.', 403);

		let admins = await userService.getAdmins(query);
        
        res.status(200).json(admins);
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const verifyUser = async (req, res) => {
    const {username, user, action} = req.body;

    try{
        if(!(await userService.isAdmin(username)))
            throw new Exception('User is forbidden from completing this action.', 403);

		await userService.verifyUser(user, action);
        if(action === "Yes"){
			await axios.put(process.env.PROFILE_URL + "verifyProfile/" + user, {username: user});
		}
        res.status(200).json({message: 'Action completed.'});
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
