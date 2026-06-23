export const isStringEmpty = (str , error_string) => {
    if(!str || typeof str !== "string"){return error_string}
    else{return ""}
}