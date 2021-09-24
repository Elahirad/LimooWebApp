const Post = require('../models/Post');

exports.createPostPage = (req, res) => {
    res.render('create-post');
};

exports.create = (req, res) => {
    let post = new Post(req.body);
    post.create().then(info => {
        req.flash('success', "Post created successfully !");
        req.session.save(() => {
            res.redirect((`/post/${info}`));
        });
    }).catch(err => {
        err.forEach(e => {
            req.flash('errors', e);
        });
        req.session.save(() => {
            res.redirect('/');
        });
    })
};

exports.viewSingle = (req, res) => {
    Post.fetchSinglePost(req.params.id).then(post => {
        if (post) {
            res.render('single-post', {post: post});
        } else {
            req.flash('errors', "Post not found !");
            req.session.save(() => {
                res.redirect('/');
            });
        }
    }).catch(err => {
        req.flash('errors', "Post not found !");
        req.session.save(() => {
            res.redirect('/');
        });
    });
};