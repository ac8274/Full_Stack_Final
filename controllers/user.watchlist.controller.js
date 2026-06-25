import {usersWatchListService} from "../services/user.watchlist.service.js"
import {jikanAnimeById} from "../utils/jikansApi.js"
import logger from "../utils/logger.js"

export const filterWatchList = async (req,res) => {
    try{
        logger.info(req)
        const {UserUID} = req.authorization;
        if(! await usersWatchListService.checkIfUserExists(UserUID)){
            throw {
                status: 401,
                Error: "FUCK YOU, Use the server as intended!"
            }
        }
        const {title, episodes, status, genreNames, genreIds} = req.query;
        if(title && typeof title !== "string")
        {
            throw {
                status: 400,
                Error: "title wasn't provided!"
            }
        }
        if(episodes && (typeof episodes !== "string" || Number.isInteger(episodes))){
            throw {
                status: 400,
                Error: "episods weren't provided!"
            }
        }
        if(status && typeof status !== "string")
        {
            throw {
                status: 400,
                Error: "stauts wasn't provided!"
            }
        }
        if(genreNames && typeof genreNames !== "string")
        {
            throw {
                status: 400,
                Error: "genreNames weren't provided!"
            }
        }
        if(genreIds && typeof genreIds !== "string")
        {
            throw {
                status: 400,
                Error: "genreIds weren't provided!"
            }
        }

        const result = await usersWatchListService.getAnimesFiltered(UserUID, title, episodes, status, genreNames, genreIds)
        res.status(result.status).json(result)
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

export const listActions = async (req,res) => {
    try{
        logger.info(req)
        const {UserUID} = req.authorization;
        if(! await usersWatchListService.checkIfUserExists(UserUID)){
            throw {
                status: 401,
                Error: "FUCK YOU, Use the server as intended!"
            }
        }
        const {mal_id} = req.params;
        let result = 0
        switch(req.method)
        {
            case "GET":
                result = await usersWatchListService.getAnimeByID(UserUID,mal_id);
                res.status(result.status).json(result)
                break;
            case "POST":
                result = await usersWatchListService.createAnimeByID(UserUID,mal_id);
                res.status(result.status).json(result)
                break;
            case "PATCH":
                if(!req.body){
                    throw {
                        status: 400,
                        Error: "Body is Required to preform this action!"
                    }
                }
                const {lastWatched} = req.body
                if(!lastWatched || typeof lastWatched !== "number" || !Number.isInteger(lastWatched))
                {
                    throw {
                        status: 400,
                        Error: "Body must include a 'lastWatched' parameter which must be an Integer"
                    }
                }

                result = await usersWatchListService.updateLatestChapterByID(UserUID,mal_id,lastWatched);
                res.status(result.status).json(result)
                break;
            case "DELETE":
                result = await usersWatchListService.deleteAnimeByID(UserUID,mal_id);
                res.status(result.status).json(result)
                break;
            default:
                res.status(400).json({Error: "The request isn't supported :)"})
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