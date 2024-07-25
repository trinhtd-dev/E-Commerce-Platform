module.exports = (objectPagination, query, totalProducts) => {
    objectPagination.totalPages = Math.ceil(totalProducts / objectPagination.limit);
     
    if(query.page)
        objectPagination.currentPage = parseInt(query.page);           
    if(parseInt(query.page)  > objectPagination.totalPages)
        objectPagination.currentPage = 1;

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limit;
    
    return objectPagination;
};