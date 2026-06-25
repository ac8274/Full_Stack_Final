import {isStringNotEmpty} from "../utils/queryValidation.js"
import { usersAuthService } from "../services/user.auth.service.js";
import logger from "../utils/logger.js"


export const signUpUser = async (req,res) => {
    try{
        logger.info(req)
        if(!req.body){
            throw {
                status: 400,
                Error: "No User Credentialls found"
            }
        }
        const {username: username, email: userEmail, password: userPassword} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //found online
        
        if(await isStringNotEmpty(username,"Username wasn't provided!\n") || await isStringNotEmpty(userEmail,"Email wasn't provided!\n") || await isStringNotEmpty(userPassword,"Password wasn't provided!\n"))
        {
            throw {
                status: 400,
                Error: await isStringNotEmpty(username,"Username wasn't provided!\n") + await isStringNotEmpty(userEmail,"Email wasn't provided!\n") + await isStringNotEmpty(userPassword,"Password wasn't provided!\n")
            }
        }
        else if(!emailRegex.test(userEmail)){throw {status: 400, Error: "Fabricated email provided!\n"}}
        else{
            const response = await usersAuthService.signUpUser(username,userEmail,userPassword);
            res.status(response.status).json(response)
        }
    }
    catch(error)
    {
        if (!(error instanceof Error))
        {
            res.status(error.status).json(error)
        }
        else
        {
            logger.error(error);
            res.status(500).json({Error: "We are so sorry to interupt you, but it seems like our servers have run into a problem!\n"});
        }
    }
}

export const signInUser = async (req,res) => {
    try{
        logger.info(req)
        if(!req.body){
            throw {
                status: 400,
                Error: "No User Credentialls found"
            }
        }
        const {nameOrEmail: nameOrEmail, password: userPassword} = req.body;
        if(await isStringNotEmpty(nameOrEmail,"Username or Email waren't provided!\n") || await isStringNotEmpty(userPassword,"Password wasn't provided!\n"))
        {
            throw {
                status: 400,
                Error: await isStringNotEmpty(nameOrEmail,"Username or Email waren't provided!\n") + await isStringNotEmpty(userPassword,"Password wasn't provided!\n")
            }
        }
        else{
            const response = await usersAuthService.signInUser(nameOrEmail,userPassword);
            res.status(response.status).json(response)
        }
    }
    catch(error)
    {
        if(!(error instanceof Error)) 
        {
            res.status(error.status).json(error)
        }
        else
        {
            res.status(500).json({Error: "We are so sorry to interupt you, but it seems like our servers have run into a problem!\n"})
        }
    }
}