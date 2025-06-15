const homeRoutes = require("./home.route");
const dashboadRoutes = require("./dashboard.route");
const productsRoutes = require("./products.route");
const systemConfig = require("../../config/system");
const productsCategoryRoutes = require("./products-category.route");
const rolesRoutes = require("./roles.route");
const accountsRoutes = require("./accounts.route");
const myAccountRoutes = require("./my-account.route");
const authsRoutes = require("./auths.route");
const generalSettingRoutes = require("./general-setting.route");

const {
  isAuthenticated,
  forwardAuthenticated,
} = require("../../middlewares/admin/auth.middleware");
const generalSettingMiddleware = require("../../middlewares/admin/general-setting.middleware");

const PATH_ADMIN = systemConfig.prefixAdmin;
module.exports = (app) => {
  app.use(PATH_ADMIN, generalSettingMiddleware.generalSetting);

  app.use(PATH_ADMIN + "/", isAuthenticated, homeRoutes);
  app.use(PATH_ADMIN + "/dashboard", isAuthenticated, dashboadRoutes);
  app.use(PATH_ADMIN + "/products", isAuthenticated, productsRoutes);
  app.use(
    PATH_ADMIN + "/products-category",
    isAuthenticated,
    productsCategoryRoutes
  );
  app.use(PATH_ADMIN + "/roles", isAuthenticated, rolesRoutes);
  app.use(PATH_ADMIN + "/accounts", isAuthenticated, accountsRoutes);
  app.use(PATH_ADMIN + "/auth", forwardAuthenticated, authsRoutes);
  app.use(PATH_ADMIN + "/my-account", isAuthenticated, myAccountRoutes);
  app.use(
    PATH_ADMIN + "/general-setting",
    isAuthenticated,
    generalSettingRoutes
  );
};
