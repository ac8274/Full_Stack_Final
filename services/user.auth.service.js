import {UsersDAL} from "../DAL/users.DAL.js"
import {hashPassword, verifyPassword} from "../utils/hash.js"
import {createToken} from "../utils/token.js"
import logger from "../utils/logger.js"


export const usersAuthService = {
    signUpUser : async (username,userEmail,userPassword) => {
        if(await UsersDAL.getUserByEmail(userEmail)){
            throw {
                status: 403, 
                Error: `User with email: "${userEmail}" already exists!`}
        }
        else if(await UsersDAL.getUserByUsername(username))
        {
            throw {
                status: 403, 
                Error: `Username - "${username}" is already taken`}
        }
        else{
            const UID = await UsersDAL.addUser(username,userEmail, await hashPassword(userPassword));
            const token = await createToken({UserUID: UID})
            return {
                status: 201,
                headers:{
                    token: token
                }
            }
        }
    },
    signInUser : async (nameOrEmail,userPassword) => {
        const user = await UsersDAL.getUserByEmail(nameOrEmail) || await UsersDAL.getUserByUsername(nameOrEmail)
        if(!user)
        {
            throw {
                status: 403,
                Error: `No User with an email or username - "${nameOrEmail}" was found!`
            }
        }
        else if (! await verifyPassword(userPassword, user["Password"]))
        {
            throw {
                status: 403,
                Error: "Incorrect Password"
            }
        }
        else
        {
            const token = await createToken({UserUID: user["UID"]})
            return {
                status: 200,
                headers:{
                    token: token
                }
            }
        }
    }
}