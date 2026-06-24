export const paramsToUrlString = (params) => {
    let paramsUrl = "?"
    Object.keys(params).forEach(key => {
        paramsUrl += `${key}=${params[key]}&`
    })
    return paramsUrl
}