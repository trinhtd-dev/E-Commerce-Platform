module.exports.items = (products) => {
    products.map(item => {
        item.newPrice = (item.price * (100 - item.discountPercentage) / 100).toFixed(2);
        return item;
    })
    return products;
};

module.exports.item = (product) => {
    product.newPrice = (item.price * (100 - item.discountPercentage) / 100).toFixed(2);
    return product;
};