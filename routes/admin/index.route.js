const homeRoutes = require("./home.route");
const dashboadRoutes = require("./dashboard.route");
const productsRoutes = require("./products.route");
const systemConfig = require("../../config/system")
const productsCategoryRoutes = require("./products-category.route");
const rolesRoutes = require("./roles.route");
const accountsRoutes = require("./accounts.route");
const authsRoutes = require("./auths.route");



const PATH_ADMIN = systemConfig.prefixAdmin;
module.exports = (app) => {
    app.use(PATH_ADMIN + "/", homeRoutes);
    app.use(PATH_ADMIN + "/dashboard", dashboadRoutes);
    app.use(PATH_ADMIN + "/products", productsRoutes);
    app.use(PATH_ADMIN + "/products-category", productsCategoryRoutes);
    app.use(PATH_ADMIN + "/roles", rolesRoutes);
    app.use(PATH_ADMIN + "/accounts", accountsRoutes);
    app.use(PATH_ADMIN + "/auths", authsRoutes);

}