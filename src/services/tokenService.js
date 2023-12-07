const jwt = require('jsonwebtoken');
const secondsInSixHours = 60 * 60 * 6;

function sessionToken(username){
	return jwt.sign({
        username: username,
        exp: Math.floor(new Date() / 1000) * secondsInSixHours,
    }, process.env.TOKEN_SECRET_KEY);
}

module.exports = {
    sessionToken,
};
