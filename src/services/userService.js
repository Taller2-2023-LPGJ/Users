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
		user.blockDate = new Date();
		await authDatabase.updateUser(user);
	} catch(err){
		throw err;
	}
}

async function unlockUser(username){
	try{
        var user = await authDatabase.getUser(username);
		if(!user){
			throw new Exception('User not found.', 404);
		}
        if(!user.isBlocked){
			throw new Exception('The user is already unlocked.', 403);
		}
        user.isBlocked = false;
		user.blockDate = null;
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
		if(user.verified === "Pending"){
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
		}else{
			throw new Exception('No pending verification request exists for the user.', 422);
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
			throw new Exception('User blocked.', 401);
		}
		if(user.verified === "Pending"){
			throw new Exception('A request is currently in progress.', 422);
		}
		if(user.verified === "Yes"){
			throw new Exception('The user profile has already been successfully verified.', 422);
		}
		
        user.verified = "Pending";
		await authDatabase.updateUser(user);
	} catch(err){
		throw err;
	}
}

async function blocked(username){
	try{
        const user = await authDatabase.getUser(username);

		if(!user)
			throw new Exception('User not found.', 404);

        return {blocked: user.isBlocked};
	} catch(err){
		throw err;
	}
}

async function isAdmin(username = '', email = ''){
	try{
		const admin = await authDatabase.isAdmin(username, email);

		return admin && admin.isAdmin
	} catch(err){
		throw err;
	}
}

async function getUser(username){
	try{
        var user = await authDatabase.getUser(username);
		return user;
	} catch(err){
		throw err;
	}
}
module.exports = {
    searchUser,
    blockUser,
    unlockUser,
    getAdmins,
    getUsers,
	getUser,
	verifyUser,
	askForVerification,
	blocked,
	isAdmin
};