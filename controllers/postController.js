const Post = require('../models/Post');

// Rendering post creating page
exports.createPostPage = (req, res) => {
    res.render('create-post');
};

// Rendering post editing page
exports.editPostPage = async (req, res) => {
    try {
        let post = await Post.fetchSinglePost(req.params.id, req.session.user._id);
        if (post.isVisitorOwner) {
            res.render('edit-post', {post: post});
        } else {
            req.flash('errors', "You don't have permission to perform this action !");
            req.session.save(() => {
                res.redirect(`/post/${req.params.id}`);
            });
        }
    } catch {
        req.flash('errors', "Failed !");
        req.session.save(() => {
            res.redirect(`/`);
        });
    }

};

// Managing POST request for creating post
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
            res.redirect('/create-post');
        });
    })
};

// Managing POST request for deleting a post
exports.delete = async (req, res) => {
    try {
        // req.params.id is a string and should be converted to a new ObjectID
        let post = await Post.fetchSinglePost(req.params.id, req.session.user._id);
        if (post.isVisitorOwner) {
            await Post.delete(post._id);
            req.flash('success', "Post deleted successfully !");
            req.session.save(() => {
                res.redirect('/');
            });
        } else {
            req.flash('errors', "You don't have permission to perform this action !");
            req.session.save(() => {
                res.redirect('/');
            });
        }
    } catch {
        req.flash('errors', "Failed to delete post !");
        req.session.save(() => {
            res.redirect('/');
        })
    }
};

// Managing POST request for post updating
exports.edit = async (req, res) => {
    try {
        let post = await Post.fetchSinglePost(req.params.id, req.session.user._id);
        // req.params.id is a string and should be converted to a new ObjectID
        if (post.isVisitorOwner) {
            let targetPost = new Post({...req.body, _id: req.params.id}, req.session.user._id);
            await targetPost.update();
            req.flash('success', "Post updated successfully !");
            req.session.save(() => {
                res.redirect(`/post/${req.params.id}`);
            });
        } else {
            req.flash('errors', "You don't have permission to perform this action !");
            req.session.save(() => {
                res.redirect('/');
            });
        }
    } catch {
        req.flash('errors', "Failed to update post !");
        req.session.save(() => {
            res.redirect('/');
        })
    }
};

// Rendering single post screen
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