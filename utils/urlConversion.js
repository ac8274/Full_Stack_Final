export const paramsToUrlString = async (params) => {
    let paramsUrl = "?"
    Object.keys(params).forEach(key => {
        paramsUrl += `${key}=${params[key]}&`
    })
    return paramsUrl
}