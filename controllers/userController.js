const User = require('../models/User');

// Managing POST request for registeration
exports.register = (req, res) => {
    let user = new User(req.body, true);
    user.register().then((id) => {
        req.flash('success', "Register success !");
        req.session.user = {
            _id: id,
            username: req.body.username,
            email: req.body.email,
            avatar: user.avatar
        }
        req.session.save(() => {
            res.redirect('/');
        });
    }).catch((errs) => {
        errs.forEach(err => {
            req.flash('errors', err);
        });
        req.session.save(() => {
            res.redirect('/');
        });
    })
};

// Managing POST request for login screen
exports.login = (req, res) => {
    let user = new User(req.body, true);
    user.login().then((info) => {
        req.session.user = {
            _id: info._id,
            username: info.username,
            email: info.password,
            avatar: user.avatar
        }
        req.flash('success', "Login success !");
        req.session.save(() => {
            res.redirect('/');
        });
    }).catch(() => {
        req.flash('errors', "Invalid username/password !");
        req.session.save(() => {
            res.redirect('/');
        });
    })
};

// Managing POST request for logging out
exports.logout = (req, res) => {
    req.session.user = undefined;
    req.flash("success", "Logged out successfully !");
    req.session.save(() => {
            res.redirect('/');
        }
    );
};

// Checking user to be logged in
exports.mustBeLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('errors', "You must be logged in to perform this action !!");
        req.session.save(() => {
            res.redirect('/');
        });
    }
};

// Rendering home page
exports.homePage = (req, res) => {
    if (req.session.user) {
        res.render('home-dashboard');
    } else {
        res.render('home-guest');
    }
};