module.exports = (query) => {
    let objectSearch = {
        keyword: "",
    };
    if(query.keyword){
        objectSearch.keyword = query.keyword;
        const regexKeyword = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regexKeyword;
    };
    return objectSearch;
}