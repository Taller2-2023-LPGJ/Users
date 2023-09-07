const jwt = require('jsonwebtoken');

function sessionToken(username){
	return jwt.sign({
        username: username,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, process.env.TOKEN_SECRET_KEY);
}

module.exports = {
    sessionToken,
};
