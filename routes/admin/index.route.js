const homeRoutes = require("./home.route");
const dashboadRoutes = require("./dashboard.route");
const productsRoutes = require("./products.route");
const systemConfig = require("../../config/system")


const PATH_ADMIN = systemConfig.prefixAdmin;
module.exports = (app) => {
    app.use(PATH_ADMIN + "/", homeRoutes);
    app.use(PATH_ADMIN + "/dashboard", dashboadRoutes);
    app.use(PATH_ADMIN + "/products", productsRoutes);
}