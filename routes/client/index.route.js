const homeRoutes = require("./home.route");
const productsRoutes = require("./products.route")
const searchRoutes = require("./search.route")
const cartRoutes = require("./cart.route")
const checkoutRoutes = require("./checkout.route")

const categoryMiddleware = require("../../middlewares/category.middleware");
const cartMiddleware = require("../../middlewares/cart.middleware");
module.exports = (app) => {
    
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    
    app.use("/", homeRoutes);
    app.use("/products", productsRoutes); 
    app.use("/search", searchRoutes); 
    app.use("/cart", cartRoutes); 
    app.use("/checkout", checkoutRoutes); 
}

