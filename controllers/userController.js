const User = require('../models/User');


exports.register = (req, res) => {
    let user = new User(req.body);
    user.register().then(() => {
        res.send("Accepted !");
    }).catch((errs) => {
        res.send(errs);
    })
};

exports.homePage = (req, res) => {
    res.render('home-guest');
};