const { sessionToken } = require('../services/tokenService');

const refreshToken = (req, res) => {
    const { user } = req.body;

    res.status(200).json({
        "token": sessionToken(user),
    });
}

module.exports = {
    refreshToken,
}
