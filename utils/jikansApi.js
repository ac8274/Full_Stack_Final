import {paramsToUrlString} from "../utils/urlConversion.js"
import logger from "../utils/logger.js"

const jikansApiBaseUrl = "https://api.jikan.moe/v4/anime"

export const jikanSearch = async (queryParams) => {
    const urlSend = jikansApiBaseUrl + paramsToUrlString(queryParams)
    const response = await fetch(urlSend);
    return response.json();
}

export const jikanAnimeById = async (id) => {
    const response = await fetch(jikansApiBaseUrl + "/" + id);
    return response.json();
}