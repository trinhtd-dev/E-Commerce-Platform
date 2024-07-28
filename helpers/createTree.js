let count = 1;
const createTree = (arr, parent = "") => {
    const result = [];
    for (let item of arr) {
        if (item.parent == parent) {
            let newItem = { ...item._doc };  
            newItem.index = count;
            count++;
            const children = createTree(arr, item._id);
            if (children.length)
                newItem.children = children;  
            result.push(newItem);
        }
    }
    return result;
}

module.exports = (records) => {
    count = 1;
    return createTree(records);
}