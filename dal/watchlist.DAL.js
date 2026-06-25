const watchlistDB = {}

export const WatchlistDAL = {
    addUser : async (UID) => {
        watchlistDB[UID.toString()] = []
    },
    addAnime : async (UID, mal_id, watchUrl, title, episodes, status, genreNames) => {
        watchlistDB[UID].push({
            id: mal_id,
            url: watchUrl,
            title: title,
            episodes: episodes,
            status: status,
            genreNames: genreNames,
            lastWatched: 1
        })
    },
    getAnimesByUID : async (UID) => {
        const result = watchlistDB[UID]
        return result;
    },
    getAnimeByID : async (UID, mal_id) =>{
        const result = watchlistDB[UID].find((animeInfo) => animeInfo["id"] === mal_id)
        return result;
    },
    getAnimesByTitle : async (UID, title) =>{
        const result = watchlistDB[UID].filter((animeInfo) => animeInfo["title"] === title)
        return result;
    },
    getAnimesByEpisodes : async (UID, episode) =>{
        const result = watchlistDB[UID].filter((animeInfo) => animeInfo["episodes"] === episode)
        return result;
    },
    getAnimesByStatus : async (UID, status) =>{
        const result = watchlistDB[UID].filter((animeInfo) => animeInfo["status"] === status)
        return result;
    },
    getAnimeByGenreNames : async (UID, genres) =>{
        const result = watchlistDB[UID].filter((animeInfo) => genres.every(genre => animeInfo["genreNames"].includes(genre)))
        return result;
    },
    deleteAnimeById : async (UID, mal_id) => {
        const index = watchlistDB[UID].findIndex((animeInfo) => animeInfo["id"] === mal_id)
        watchlistDB[UID].splice(index,1);
    },
    updateLatestEpisodeByID : async (UID,mal_id,episode) => {
        const index = watchlistDB[UID].findIndex((animeInfo) => animeInfo["id"] === mal_id)
        watchlistDB[UID][index]["lastWatched"] = episode
    }
}