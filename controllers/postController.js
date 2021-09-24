const Post = require('../models/Post');

exports.createPostPage = (req, res) => {
    res.render('create-post');
};

exports.create = (req, res) => {
    let post = new Post(req.body, req.session.user._id);
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

exports.delete = (req, res) => {
    Post.fetchSinglePost(req.params.id, req.session.user._id).then(post => {
        if (post.isVisitorOwner) {
            Post.delete(post._id).then(() => {
                req.flash('success', "Post deleted successfully !");
                req.session.save(() => {
                    res.redirect('/');
                });
            }).catch(() => {
                req.flash('errors', "Failed to delete post !");
                req.session.save(() => {
                    res.redirect('/');
                });
            });
        } else {
            req.flash('errors', "You don't have permission to perform this action !");
            req.session.save(() => {
                res.redirect('/');
            });
        }
    }).catch(() => {
        req.flash('errors', "Failed to delete post !");
        req.session.save(() => {
            res.redirect('/');
        });
    });

};

exports.viewSingle = (req, res) => {
    Post.fetchSinglePost(req.params.id, req.session.user._id).then(post => {
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