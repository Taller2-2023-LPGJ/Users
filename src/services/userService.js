const authDatabase = require('../database/authDatabase');
const Exception = require('./exception');

async function searchUser(user){
	try{
		var userFound = await authDatabase.searchUser(user);
        if(!userFound){
            throw new Exception('User not found.', 422);
        }
        return {"name": userFound.username, "email": userFound.email};
	} catch(err){
		throw err;
	}
}

async function blockUser(username){
	try{
        var user = await authDatabase.getUser(username);
		if(!user){
			throw new Exception('User not found.', 422);
		}
        if(user.isBlocked){
			throw new Exception('The user has already been blocked.', 401);
		}
        user.isBlocked = true;
		await authDatabase.updateUser(user);
	} catch(err){
		throw err;
	}
}

async function isAdmin(username){
	try{
        var user = await authDatabase.getUser(username);
		if(!user){
			throw new Exception('User not found.', 422);
		}

        return user.isAdmin;
	} catch(err){
		throw err;
	}
}

async function unlockUser(username){
	try{
        var user = await authDatabase.getUser(username);
		if(!user){
			throw new Exception('User not found.', 422);
		}
        if(!user.isBlocked){
			throw new Exception('The user is already unlocked.', 403);
		}
        user.isBlocked = false;
		await authDatabase.updateUser(user);
	} catch(err){
		throw err;
	}
}

async function getAdmins(query){
	try{
        var admins = await authDatabase.getUsersPagination(query, true);
		
       return admins;
	} catch(err){
		throw err;
	}
}

async function getUsers(query){
	try{
        var users = await authDatabase.getUsersPagination(query, false);
		
       return users;
	} catch(err){
		throw err;
	}
}

async function verifyUser(username, action){
	try{
        var user = await authDatabase.getUser(username);
		if(!user){
			throw new Exception('User not found.', 422);
		}

		if(action === "Yes"){
			if(user.verified === "Yes"){
				throw new Exception('The user has already been verified.', 422);
			}
		}else if(action === "No"){
			if(user.verified === "No"){
				throw new Exception('The user has already been denied verification.', 422);
			}
			user.verified = false;
		}else{
			throw new Exception('wrong action.', 422);
		}
        user.verified = action;
		await authDatabase.updateUser(user);
	} catch(err){
		throw err;
	}
}

async function askForVerification(username){
	try{
        var user = await authDatabase.getUser(username);
		if(!user){
			throw new Exception('User not found.', 422);
		}
        if(user.isBlocked){
			throw new Exception('User blocked.', 403);
		}

        user.verified = "Pending";
		await authDatabase.updateUser(user);
	} catch(err){
		throw err;
	}
}

module.exports = {
    searchUser,
    blockUser,
    isAdmin,
    unlockUser,
    getAdmins,
    getUsers,
	verifyUser,
	askForVerification
};