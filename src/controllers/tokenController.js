const tokenService = require('../services/tokenService');

const sessionToken = (req, res) => {
    const { username } = req.body;

    try{
		let token = tokenService.sessionToken(username);

        res.status(200).json({
            "token": token,
        });
	} catch(error){
        console.error(error);
        res.status(500).json({ message: 'Token creation error' });
    }
}

module.exports = {
    sessionToken,
}
