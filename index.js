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

// json parser
app.use(express.json());

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

// Centralized Error Handling
app.use((err, req, res, next) => {
  // Log the error internally
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  // Respond with a user-friendly error page
  // Avoid leaking stack trace to the client in production
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "An unexpected error occurred. Please try again later."
      : err.message;

  res.status(statusCode).render("client/pages/error/500", {
    pageTitle: "Error",
    message: message,
  });
});

server.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
