//reuire
const express = require("express");
const path = require("path");
const clientRoutes = require("./routes/client/index.route");
const adminRoutes = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const logger = require("./config/logger");
const { logRequest } = require("./middlewares/request-logger.middleware");

const app = express();

// Socket.io
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

app.use(cookieParser());
//Set Express Flash : Alert
app.use(
  session({
    secret: "keyboard cat", // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
// Set up flash middleware
app.use(flash());

// Set BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//Set Override method
app.use(methodOverride("_method"));

//Set dynamic var in system config
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// process port in .evn
const port = process.env.PORT;

//set Views
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//connect to MongoDB
database.connect();

//static file
app.use(express.static(`${__dirname}/public`));

//tinyClound
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//routes
adminRoutes(app);
clientRoutes(app);

// Add request logging middleware
app.use(logRequest);

// Log unhandled errors
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).render("client/pages/error/500", {
    message: "Internal Server Error",
  });
});

server.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
