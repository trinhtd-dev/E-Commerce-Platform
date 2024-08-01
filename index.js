//reuire
const express = require("express");
const path = require('path');
require("dotenv").config();
const clientRoutes = require("./routes/client/index.route");
const adminRoutes = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system")
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash  = require("express-flash");
const session = require('express-session');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cookieParser());
//Set Express Flash : Alert
app.use(session({
    secret: 'keyboard cat', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }));
  // Set up flash middleware
  app.use(flash());
  
// Set BodyParser
app.use(bodyParser.urlencoded({ extended: false }))

//Set Override method
app.use(methodOverride('_method')); 

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
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


//routes
clientRoutes(app);
adminRoutes(app);



app.listen(port, () => console.log(`Server running on port ${port}`));
