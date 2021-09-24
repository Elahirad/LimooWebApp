const postsCollection = require('../db').db().collection('posts');
const ObjectID = require('mongodb').ObjectID;
const sanitizeHTML = require('sanitize-html');

class Post {
    constructor(data) {
        this.data = data;
        this.errors = [];
    }

    cleanUp() {
        if (typeof (this.data.title) !== "string") this.data.title = "";
        if (typeof (this.data.body) !== "string") this.data.body = "";
        this.data = {
            title: sanitizeHTML(this.data.title, {allowedTags: [], allowedAttributes: {}}),
            body: sanitizeHTML(this.data.body, {allowedTags: [], allowedAttributes: {}})
        };
    }

    validate() {
        if (this.data.title === "") this.errors.push("You should provide a title for your post !");
        if (this.data.body === "") this.errors.push("You should provide a body for your post !");
    }

    create() {
        return new Promise((resolve, reject) => {
            this.cleanUp();
            this.validate();
            if (!this.errors.length) {
                postsCollection.insertOne(this.data).then(info => {
                    resolve(info.insertedId);
                }).catch(e => {
                    reject(e)
                });
            } else {
                reject(this.errors);
            }
        })
    }


}

Post.fetchSinglePost = (postId) => {
    return new Promise((resolve, reject) => {
        postsCollection.findOne({_id: new ObjectID(postId)}).then(info => {
            resolve(info);
        }).catch(e => {
            reject(e);
        });
    });
};

module.exports = Post;