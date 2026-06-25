import { jikanSearch, jikanAnimeById } from "../utils/jikansApi.js";
import { maxPage } from "../config/index.js";
import { includeFromDictArr } from "../utils/includeFromData.js";
import logger from "../utils/logger.js"

export const getAnimeList = async (req,res) => {
    try{
        if(!req.query){
            const queryResult = await jikanSearch({page: Math.floor(Math.random() * maxPage)});
            res.status(200).json(await includeFromDictArr(queryResult.data,"mal_id","url","title","episodes","status","duration","synopsis"));
        }
        const queryResult = await jikanSearch(req.query);
        if(queryResult.status >= 400){
            throw queryResult
        }
        
        res.status(200).json(await includeFromDictArr(queryResult.data,"mal_id","url","title","episodes","status","duration","synopsis"));
    }
    catch (error)
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

export const getAnimeListById = async (req,res) => {
    try
    {
        const {id} = req.params;
        const queryResult = await jikanAnimeById(id);
        if(queryResult.status >= 400){
            throw queryResult
        }
        res.status(200).json(queryResult.data);
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