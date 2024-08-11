module.exports.token = (number) => {
    const string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < number; i++) {
        result += string.charAt(Math.floor(Math.random() * string.length));
    }
    return result; 
}
 
module.exports.generateRandomNumber = (number) => {
    const string = "0123456789";
    let result = "";
    for (let i = 0; i < number; i++) {
        result += string.charAt(Math.floor(Math.random() * string.length));
    }
    return result; 
}
 