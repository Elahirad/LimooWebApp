const User = require('../models/User');
exports.register = (req, res) => {
    let user = new User(req.body);
    user.register().then((id) => {
        req.flash('success', "Register success !");
        req.session.user = {
            _id: id,
            username: req.body.username,
            email: req.body.email
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

exports.login = (req, res) => {
    let user = new User(req.body);
    user.login().then((info) => {
        req.session.user = {
            _id: info._id,
            username: info.username,
            email: info.password
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

exports.logout = (req, res) => {
    req.session.user = undefined;
    req.flash("success", "Logged out successfully !");
    req.session.save(() => {
            res.redirect('/');
        }
    );
};

exports.homePage = (req, res) => {
    res.render('home-guest');
};