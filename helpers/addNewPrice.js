module.exports.items = (products) => {
  products.map((item) => {
    const price = item.price || 0;
    const discount = item.discountPercentage || 0;
    item.priceNew = ((price * (100 - discount)) / 100).toFixed(0);
    return item;
  });
  return products;
};

module.exports.item = (product) => {
  const price = product.price || 0;
  const discount = product.discountPercentage || 0;
  product.priceNew = ((price * (100 - discount)) / 100).toFixed(0);
  return product;
};
