const jwt = require('jsonwebtoken');

function sessionToken(user){
	return jwt.sign({
        user: user,
        exp: 3 * Math.floor(Date.now() / 1000) + (60 * 60),
    }, process.env.TOKEN_SECRET_KEY);
}

module.exports = {
    sessionToken,
};
