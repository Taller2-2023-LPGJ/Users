const userService = require('../services/userService');

const searchUser = async (req, res) => {
    const { user } = req.query;

    try{
		let userFound = await userService.searchUser(user);

        res.status(200).json(userFound);
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

module.exports = {
    searchUser
}
