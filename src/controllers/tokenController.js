const { sessionToken } = require('../services/tokenService');

const refreshToken = (req, res) => {
    const { username } = req.body;

    res.status(200).json({
        "token": sessionToken(username),
    });
}

module.exports = {
    refreshToken,
}
