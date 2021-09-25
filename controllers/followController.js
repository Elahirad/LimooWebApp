const Follow = require('../models/Follow');

exports.create = (req, res) => {
    let follow = new Follow({followedUsername: req.params.username, followerId: req.session.user._id});
    follow.create().then(() => {
        req.flash("success", `Followed ${req.params.username} successfully !`);
        req.session.save(() => {
            res.redirect(`/user/${req.params.username}`);
        });
    }).catch((errs) => {
        errs.forEach(err => {
            req.flash("errors", err);
        });
        req.session.save(() => {
            res.redirect(`/user/${req.params.username}`);
        });
    });
};

exports.remove = (req, res) => {
    let follow = new Follow({ followedUsername: req.params.username, followerId: req.session.user._id });
    follow.remove().then(() => {
        req.flash('success', `Successfully unfollowed ${req.params.username} !`);
        req.session.save(() => {
            res.redirect(`/user/${req.params.username}`);
        });
    }).catch((errs) => {
        errs.forEach(err => {
            req.flash("errors", err);
        });
        req.session.save(() => {
            res.redirect(`/user/${req.params.username}`);
        });
    });
};

// Checking if visitor followed username
exports.checkFollow = async (req, res, next) => {
    req.followed = await Follow.checkFollowing(req.params.username, req.session.user._id);
    next();
};