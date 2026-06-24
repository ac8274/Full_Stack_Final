import {verifyToken} from "../utils/token.js"

export const isReqHasBody = (req, res, next) => {
    const {body,method} = req    
    !body ||  Object.keys(body).length === 0 && (method!== "GET" && method !== "DELETE") ?
        res.status(400).send("Body (data) is required") :
        next()
}

export const isTokenValid = (req, res, next) => {
    try
    {
        const tokenData = await verifyToken(req.headers.authorization)
        req.authorization = tokenData["token"]
        next()
    }
    catch(error){
        res.status(401).json({Error: "Verify Token Integraty"})
    }
}