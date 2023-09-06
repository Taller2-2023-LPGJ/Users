const authService = require('../services/authService');

const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    try{
		await authService.signUp(username, email, password);

        res.status(200).json('Successful sign-up');
	} catch(error){
        console.error(error);
        res.status(500).json({ message: 'User sign up error' });
    }
}

const signIn = async (req, res) => {
    const {userIdentifier, password} = req.body;

    try{
		await authService.signIn(userIdentifier, password);

        res.status(200).json('Successful sign-in.');
	} catch(error){
        console.error(error);
        res.status(500).json({ message: 'User register Error' });
    }
}

module.exports = {
    signUp,
	signIn
}
