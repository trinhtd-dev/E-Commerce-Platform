const homeRoutes = require("./home.route");
const productsRoutes = require("./products.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");

const categoryMiddleware = require("../../middlewares/category.middleware");
const cartMiddleware = require("../../middlewares/cart.middleware");
const userMiddleware = require("../../middlewares/user.middleware");
const generalSettingMiddleware = require("../../middlewares/general-setting.middleware");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.user);
    app.use(generalSettingMiddleware.generalSetting);

    app.use("/", homeRoutes);
    app.use("/products", productsRoutes);
    app.use("/search", searchRoutes);
    app.use("/cart", cartRoutes);
    app.use("/checkout", checkoutRoutes);
    app.use("/user", userRoutes);

    // Middleware 404 put in after all route
     app.use((req, res) => {
        res.status(404).render('client/pages/error/404');
    });
};