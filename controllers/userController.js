const User = require('../models/User');
exports.register = (req, res) => {
    let user = new User(req.body);
    user.register().then(() => {
        req.flash('success', "Register success !");
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

exports.login = (req, res) => {
    let user = new User(req.body);
    user.login().then(() => {
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

exports.homePage = (req, res) => {
    res.render('home-guest');
};