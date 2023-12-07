const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const searchUser = async (req, res) => {
    const { user } = req.query;

    try{
		let userFound = await userService.searchUser(user);

        res.status(200).json(userFound);
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const getUsers = async (req, res) => {
    const query = req.query;

    try{
		let users = await userService.getUsers(query);

        res.status(200).json(users);
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const askForVerification = async (req, res) => {
    var token = req.headers.token;

    try{
        var decodedClaims = null;
        try{
            decodedClaims = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        } catch(err){
            res.status(401).json('invalid token does not exist');
        }
        var username = decodedClaims.username;
        await userService.askForVerification(username);

        res.status(200).json('Request sent');
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

module.exports = {
    getUsers,
    searchUser,
    askForVerification
}
