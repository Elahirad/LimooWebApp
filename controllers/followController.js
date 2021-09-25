const Follow = require('../models/Follow');
const User = require("../models/User");

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
    let follow = new Follow({followedUsername: req.params.username, followerId: req.session.user._id});
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
    let user = await User.searchByUsername(req.params.username, req.session.user._id);
    if (user) {
        req.user = user;
    } else {
        req.flash('errors', "User not found !");
        req.session.save(() => {
            res.redirect('/');
        });
    }
    next();
};

exports.viewUserFollowers = async (req, res) => {
    let followers = await Follow.fetchFollowers(req.user._id);
    let avatar = new User({ email: req.user.email }).getAvatar();
    res.render('user-followers', {
        t_user: {...req.user, avatar: avatar},
        followers: followers,
        followed: req.followed,
        postsCount: req.postsCount,
        followingCount: req.followingCount,
        followerCount: req.followerCount,
        isVisitorOwner: req.user.isVisitorOwner,
        page:"followers"
    });

};

exports.viewUserFollowings = async (req, res) => {
    let followings = await Follow.fetchFollowings(req.user._id);
    let avatar = new User({ email: req.user.email }).getAvatar();
    res.render('user-followings', {
        t_user: {...req.user, avatar: avatar},
        followings: followings,
        followed: req.followed,
        postsCount: req.postsCount,
        followingCount: req.followingCount,
        followerCount: req.followerCount,
        isVisitorOwner: req.user.isVisitorOwner,
        page:"followings"
    });

};