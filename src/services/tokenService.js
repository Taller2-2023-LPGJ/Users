const jwt = require('jsonwebtoken');

function sessionToken(user){
	return jwt.sign({
        user: user,
    }, process.env.TOKEN_SECRET_KEY);
}

module.exports = {
    sessionToken,
};
