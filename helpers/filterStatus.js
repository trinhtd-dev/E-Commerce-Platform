module.exports = (query) =>{
    const filterStatus = [
        {
            name: "All",
            class: "",
            status: "",
        },
        {
            name: "Active",
            class: "",
            status: "active",
        },
        {
            name: "Inactive",
            class: "",
            status: "inactive",
        },
    ];

    if(query.status){
        const index = filterStatus.findIndex(item => item.status === query.status);
        filterStatus[index].class = "active";
    }
    else{
        const index = filterStatus.findIndex(item => item.status === "");
        filterStatus[index].class = "active";
    }
    return filterStatus;
};