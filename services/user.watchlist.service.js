import {WatchlistDAL} from "../DAL/watchlist.DAL.js"
import logger from "../utils/logger.js"
import {jikanGenreById} from "../utils/jikansApi.js"

export const usersWatchListService =  {
    getAnimesFiltered : async (UID, title, episodes, status, genreNames, genreIds) => {
        let animes = WatchlistDAL.getAnimesByUID(UID);
        if(title){
            animes = animes.filter((animeInfo) => animeInfo["title"].includes(title))
        }
        if(episodes){
            animes = animes.filter((animeInfo) => animeInfo["episodes"] === episodes)
        }
        if(status){
            animes = animes.filter((animeInfo) => animeInfo["status"] === status)
        }
        if(genreNames && genreIds) {
            names = genreNames.split(",")
            ids = genreIds.split(",").map((genereId) => jikanGenreById(genereId))
            if(ids.includes("")){throw {status: 400, Erro:"some\\all genres IDS are non existent!"}}
            const genres = [...new Set([...names, ...ids])]
            animes = animes.filter((animeInfo) => genres.every(genre => animeInfo["genreNames"].includes(genre)))
        }
        return {status:200, Message: animes};
    },
    
    getAnimeByID : async (UID,mal_id) => {
        const anime = await WatchlistDAL.getAnimeByID(UserUID,mal_id)
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
        const anime = await jikanAnimeById(mal_id);

        if(anime.status >= 400){
            throw anime
        }

        const genreNames = anime["genres"].map((genreInfo) => genreInfo["name"])
        const explicitGenresNames = anime["explicit_genres"].map((genreInfo) => genreInfo["name"])
        const themesNames = anime["themes"].map((genreInfo) => genreInfo["name"])
        const demographicsNames = anime["demographics"].map((genreInfo) => genreInfo["name"])

        const genres = [...new Set([...genreNames, ...explicitGenresNames, ...themesNames, ...demographicsNames])]

        await WatchlistDAL.addAnime(UID, mal_id, anime.url, anime.title, anime.episodes, anime.status, genres)

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
        const anime = await WatchlistDAL.getAnimeByID(UID,mal_id)
        if(!anime){throw{status:404, Error:"Couldn't find the anime with id: "+mal_id+" in you watching list"}}
        else if(anime["episodes"] < episodes){throw{status: 400, Error:"The latest episode exceeds max episodes count"}}
        else if(1 > episodes){throw{status: 400, Error:"The latest episode cannot be below 1"}}
        WatchlistDAL.updateLatestEpisodeByID(UID,mal_id,episodes)
        return {status: 204}
    }
}