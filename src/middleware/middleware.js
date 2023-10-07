const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const userNotBlocked = async (req, res, next) => {
    const authHeader = req.headers;
    let isBlocked = true;
    if(isBlocked){
        res.status(401).json('user blocked');
    }else{
        next();
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
            res.status(401).json('User does not have permission for this action');
        }
	} catch(err){
        res.status(err.statusCode ?? 500).json({ message: err.message ?? 'An unexpected error has occurred. Please try again later.'});
    }
}

module.exports = {
    userNotBlocked,
    userAdmin
}