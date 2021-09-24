const express = require('express');
const app = express();
const router = require('./router');
require('dotenv').config();
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('connect-flash');
const csrf  = require('csurf');
const sessionOptions = session({
    store: new MongoStore({
        mongoUrl: process.env.CONNECTIONSTRING,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true}
    }),
    secret: "ASvdcTyuESdvvCzXEg",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7
    }
});
app.use(sessionOptions);
app.use(express.json())
app.use(flash());
app.use(express.urlencoded({extended: false}));
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use((req, res, next) => {

    // Making session data available on EJS templates
    res.locals.user = req.session.user;
    // Making flash messages available on EJS templates
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('errors');
    next();
});
app.use(csrf());
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use((err, req, res, next) => {
    if (err) {
        if (err.code === "EBADCSRFTOKEN"){
            req.flash("errors", "Cross Site Request Forgery Attack detected !");
            req.session.save(() => {
                res.redirect('/');
            })
        }
    }
});
app.use('/', router);
app.use(express.static('public'));
module.exports = app;