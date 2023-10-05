// to use .env file in all app
require('dotenv').config();

// creates an express server
const express = require('express');

const expressLayout = require('express-ejs-layouts');

const methodOverride = require('method-override');

const cookieParser = require('cookie-parser');

const session = require('express-session');

const MongoStore = require('connect-mongo');

// connects database
const connectDB = require('./server/config/db')

const { isActiveRoute } = require('./server/helpers/routeHelpers');

// creates an express app
const app = express();

// 5000 is default || if we want to publish to server then we have to use their default port
const PORT = 5000 || process.env.PORT;

// connect to database
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

// public folder (contains all css, js, img etc)
app.use(express.static('public'));

// Templating engine (to use express-ejs-layouts)(middleware)
app.use(expressLayout);
// default layout for app
app.set('layout', './layouts/main');
// set the view engine to ejs
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

// this app will listen to this port number
app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`);
});
