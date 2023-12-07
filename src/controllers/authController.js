const axios = require('axios');
const authService = require('../services/authService');
const userService = require('../services/userService');
const { sessionToken } = require('../services/tokenService');

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
		await authService.signUp(username, email, password);
        dogstatsd.increment('users.register.user_password');
        res.status(200).json('code sent');
	} catch(err){
	    console.log(err);
        res.status(err.statusCode).json({ message: err.message });
    }
}

const signUpConfirm = async (req, res) => {
    const { username, code } = req.body;

    try{
		await authService.signUpConfirm(username, code);
        
        const profileRes = await axios.post(process.env.PROFILE_URL, {username: username});

        if(profileRes.status !== 200){
            authService.deleteUser(username);
            res.status(profileRes.status).json({message: profileRes.data.message});
        } else{
            dogstatsd.increment('users.register.successful_federated_identity');
            let user = await userService.getUser(username);
            dogstatsd.timing('users.register.successful_average_time', new Date() - new Date(user.creationDate));
            res.status(200).json({token: sessionToken(username)});
        }
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const signIn = async (req, res) => {
    const {userIdentifier, password} = req.body;

    try{
		const user = await authService.signIn(userIdentifier, password);
        dogstatsd.increment('users.login.successful_user_password');
        res.status(200).json({token: sessionToken(user.username)});
	} catch(err){
	    console.log(err);
        dogstatsd.increment('users.login.fail_user_password');
        res.status(err.statusCode).json({ message: err.message });
    }
}

const signUpGoogle = async (req, res) => {
    const { name, email} = req.body;

    try{
		let user = await authService.signUpGoogle(name, email);

        const profileRes = await axios.post(process.env.PROFILE_URL, {username: user.username});

        if(profileRes.status !== 200){
            authService.deleteUser(user.username);
            res.status(profileRes.status).json({message: response.data.message});
        } else{
            dogstatsd.increment('users.register_federated_identity');
            res.status(200).json({token: sessionToken(user.username)});
        }
	} catch(err){
        console.log(err);
        res.status(err.statusCode).json({ message: err.message });
    }
}

const signInGoogle = async (req, res) => {
    const {email} = req.body;

    try{
		const username = await authService.signInGoogle(email);
        dogstatsd.increment('users.login.successful_federated_identity');
        res.status(200).json({token: sessionToken(username)});
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}
const recoverPassword = async (req, res) => {
    const {username} = req.body;

    try{
		await authService.recoverPassword(username);
        dogstatsd.increment('users.recoverPassword.requests_recover_password');
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
        dogstatsd.increment('users.recoverPassword.success_recover_password');
        let user = await userService.getUser(username);
        dogstatsd.timing('users.recoverPassword.recover_time', new Date() - new Date(user.recoverPasswordDate));
        res.status(200).json('Password has been succesfully reset.');
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const blocked = async (req, res) => {
    const {username} = req.query;
    
    try{
        const status = await userService.blocked(username);

        res.status(200).json(status);
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

module.exports = {
    signUp,
    signUpConfirm,
	signIn,
    signUpGoogle,
    signInGoogle,
    recoverPassword,
    verifyCodeRecoverPassword,
    setPassword,
    blocked
}
