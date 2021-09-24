const postsCollection = require('../db').db().collection('posts');
const ObjectID = require('mongodb').ObjectID;
const sanitizeHTML = require('sanitize-html');

class Post {
    constructor(data, authorId) {
        this.data = data;
        this.errors = [];
        this.authorId = authorId;
    }

    cleanUp() {
        if (typeof (this.data.title) !== "string") this.data.title = "";
        if (typeof (this.data.body) !== "string") this.data.body = "";
        this.data = {
            _id: this.data._id,
            // Sanitizing title and body to protect DB from malicious HTML
            title: sanitizeHTML(this.data.title, {allowedTags: [], allowedAttributes: {}}),
            body: sanitizeHTML(this.data.body, {allowedTags: [], allowedAttributes: {}}),
            authorId: new ObjectID(this.authorId),
            createdDate: new Date()
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

    update() {
        return new Promise((resolve, reject) => {
            this.cleanUp();
            this.validate();
            postsCollection.findOneAndUpdate({_id: new ObjectID(this.data._id)}, {
                $set: {
                    title: this.data.title,
                    body: this.data.body
                }
            }).then(() => {
                resolve();
            }).catch(e => {
                console.log(e);
                reject();
            });
        });
    }


}

Post.fetchSinglePost = (postId, visitorId) => {
    return new Promise((resolve, reject) => {
        // postId should be a string not a ObjectID
        postsCollection.findOne({_id: new ObjectID(postId)}).then(info => {
            let isVisitorOwner = info.authorId.equals(visitorId);
            let post = {
                _id: info._id,
                title: info.title,
                body: info.body,
                authorId: info.authorId,
                createdDate: info.createdDate,
                isVisitorOwner: isVisitorOwner
            };
            resolve(post);
        }).catch(e => {
            reject(e);
        });
    });
};

Post.delete = (postId) => {
    return new Promise((resolve, reject) => {
        postsCollection.deleteOne({_id: postId}).then(() => {
            resolve();
        }).catch(() => {
            reject()
        });
    });
};

module.exports = Post;