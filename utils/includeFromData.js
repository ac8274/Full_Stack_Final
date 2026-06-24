export const includeFromDictionary = async (data, ...include) => {
    let returnData = {}

    include.map(key => {returnData[key] = data[key]})
    console.log(returnData)
    return returnData
}

export const includeFromDictArr = async (data, ...include) => {
    const new_arr = []
    for(let i=0; i<data.length; i++)
    {
        new_arr.push(await includeFromDictionary(data[i], ...include));
    }
    return new_arr;
}