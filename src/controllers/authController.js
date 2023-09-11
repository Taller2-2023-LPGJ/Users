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

module.exports = {
    signUp,
	signIn
}
