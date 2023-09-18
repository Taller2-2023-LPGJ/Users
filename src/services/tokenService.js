const jwt = require('jsonwebtoken');

function sessionToken(username){
	return jwt.sign({
        username: username,
    }, process.env.TOKEN_SECRET_KEY);
}

module.exports = {
    sessionToken,
};
