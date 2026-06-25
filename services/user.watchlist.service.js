import {WatchlistDAL} from "../DAL/watchlist.DAL.js"
import logger from "../utils/logger.js"
import {jikanAnimeById,jikanGenreById} from "../utils/jikansApi.js"

export const usersWatchListService =  {
    getAnimesFiltered : async (UID, title, episodes, status, genreNames, genreIds) => {
        let animes = await WatchlistDAL.getAnimesByUID(UID);
        if(title){
            animes = animes.filter((animeInfo) => animeInfo["title"].includes(title))
        }
        if(episodes){
            episodes = parseInt(episodes,10)
            animes = animes.filter((animeInfo) => animeInfo["episodes"] === episodes)
        }
        if(status){
            animes = animes.filter((animeInfo) => animeInfo["status"] === status)
        }
        if(genreNames && genreIds) {
            const names = genreNames.split(",")
            const ids = genreIds.split(",").map((genreId) => jikanGenreById(genreId))
            if(ids.includes("")){throw {status: 400, Erro:"some\\all genres IDS are non existent!"}}
            const genres = [...new Set([...names, ...ids])]
            animes = animes.filter((animeInfo) => genres.every(genre => animeInfo["genreNames"].includes(genre)))
        }
        else if(genreNames)
        {
            const genres = genreNames.split(",");
            animes = animes.filter((animeInfo) => genres.every(genre => animeInfo["genreNames"].includes(genre)))
        }
        else if(genreIds){
            const ids = genreIds.split(",").map((genreId) => jikanGenreById(genreId))
            if(ids.includes("")){throw {status: 400, Erro:"some\\all genres IDS are non existent!"}}
            animes = animes.filter((animeInfo) => ids.every(genre => animeInfo["genreNames"].includes(genre)))
        }
        return {status:200, Message: animes};
    },
    
    getAnimeByID : async (UID,mal_id) => {
        const anime = await WatchlistDAL.getAnimeByID(UID,mal_id)
        if(!anime)
        {
            throw{
                status:404, 
                Error:"Couldn't find the anime with id: "+mal_id+" in you watching list"
            }
        }
        return {status: 200, Message: anime}
    },

    createAnimeByID : async (UID,mal_id) => {
        if(await WatchlistDAL.getAnimeByID(UID,mal_id)){
            throw{
                status: 403,
                Error: "Sorry but it seems like you already have this anime in your watchlist!"
            }
        }

        const anime = await jikanAnimeById(mal_id);

        if(anime.status >= 400){
            throw anime
        }
        const genreNames = anime.data["genres"].map((genreInfo) => genreInfo["name"])
        const explicitGenresNames = anime.data["explicit_genres"].map((genreInfo) => genreInfo["name"])
        const themesNames = anime.data["themes"].map((genreInfo) => genreInfo["name"])
        const demographicsNames = anime.data["demographics"].map((genreInfo) => genreInfo["name"])

        const genres = [...new Set([...genreNames, ...explicitGenresNames, ...themesNames, ...demographicsNames])]

        await WatchlistDAL.addAnime(UID, mal_id, anime.data.url, anime.data.title, anime.data.episodes, anime.data.status, genres)

        const newAnime = await WatchlistDAL.getAnimeByID(UID,mal_id);

        return {
            status: 201, 
            Message: newAnime
        }
    },
    deleteAnimeByID : async (UID,mal_id) => {
        if(! await WatchlistDAL.getAnimeByID(UID,mal_id)){throw{status:404, Error:"Couldn't find the anime with id: "+mal_id+" in you watching list"}}
        await WatchlistDAL.deleteAnimeById(UID,mal_id)
        return {status: 204}
    },
    updateLatestChapterByID : async (UID,mal_id,episodes) => {
        episodes = parseInt(episodes,10)
        const anime = await WatchlistDAL.getAnimeByID(UID,mal_id)
        if(!anime){throw{status:404, Error:"Couldn't find the anime with id: "+mal_id+" in you watching list"}}
        else if(anime["episodes"] < episodes){throw{status: 400, Error:"The latest episode exceeds max episodes count"}}
        else if(1 > episodes){throw{status: 400, Error:"The latest episode cannot be below 1"}}
        WatchlistDAL.updateLatestEpisodeByID(UID,mal_id,episodes)
        return {status: 204}
    },
    checkIfUserExists : async (UID) => {
        const user = await WatchlistDAL.getAnimesByUID(UID);
        return user || false;
    }
}