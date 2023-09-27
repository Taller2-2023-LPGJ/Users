const authDatabase = require('../database/authDatabase');
const Exception = require('./exception');

async function searchUser(user){
	try{
		var userFound = await authDatabase.searchUser(user);
        if(!userFound){
            throw new Exception('User not found.', 401);
        }
        return {"name": userFound.username, "email": userFound.email};
	} catch(err){
		throw err;
	}
}

module.exports = {
    searchUser
};