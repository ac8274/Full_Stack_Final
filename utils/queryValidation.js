export const isStringNotEmpty = async (str , error_string) => {
    if(!str || typeof str !== "string"){return error_string}
    else{return ""}
}