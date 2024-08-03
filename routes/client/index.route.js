const homeRoutes = require("./home.route");
const productsRoutes = require("./products.route")

const categoryMiddleware = require("../../middlewares/category.middleware");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use("/", homeRoutes);
    app.use("/products", productsRoutes); 
}

