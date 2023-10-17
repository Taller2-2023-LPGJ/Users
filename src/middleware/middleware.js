const userService = require('../services/userService');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

const verifyAuth = async (req, res, next) => {
    var token = req.headers.token;
    try{
		var decodedClaims = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        var username = decodedClaims.username;
        await authService.verifyAuthUser(username);
        next();
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

const userAdmin = async (req, res, next) => {
    var token = req.headers.token;
    try{
		var decodedClaims = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        var username = decodedClaims.username;
        var isAdmin = await userService.isAdmin(username);
        if(isAdmin){
            next();
        }else{
            res.status(403).json('User does not have permission for this action');
        }
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

module.exports = {
    userAdmin,
    verifyAuth
}