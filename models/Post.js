const User = require("../models/User");
const postsCollection = require("../db").db().collection("posts");
const ObjectID = require("mongodb").ObjectID;
const sanitizeHTML = require("sanitize-html");

class Post {
  constructor(data, authorId) {
    this.data = data;
    this.errors = [];
    this.authorId = authorId;
  }

  cleanUp() {
    if (typeof this.data.title !== "string") this.data.title = "";
    if (typeof this.data.body !== "string") this.data.body = "";
    this.data = {
      _id: this.data._id,
      // Sanitizing title and body to protect DB from malicious HTML
      title: sanitizeHTML(this.data.title, {
        allowedTags: [],
        allowedAttributes: {},
      }),
      body: sanitizeHTML(this.data.body, {
        allowedTags: [],
        allowedAttributes: {},
      }),
      authorId: new ObjectID(this.authorId),
      createdDate: new Date(),
    };
  }

  validate() {
    if (this.data.title === "")
      this.errors.push("You should provide a title for your post !");
    if (this.data.body === "")
      this.errors.push("You should provide a body for your post !");
  }

  create() {
    return new Promise((resolve, reject) => {
      this.cleanUp();
      this.validate();
      if (!this.errors.length) {
        postsCollection
          .insertOne(this.data)
          .then((info) => {
            resolve(info.insertedId);
          })
          .catch((e) => {
            reject(e);
          });
      } else {
        reject(this.errors);
      }
    });
  }

  update() {
    return new Promise((resolve, reject) => {
      this.cleanUp();
      this.validate();
      postsCollection
        .findOneAndUpdate(
          { _id: new ObjectID(this.data._id) },
          {
            $set: {
              title: this.data.title,
              body: this.data.body,
            },
          }
        )
        .then(() => {
          resolve();
        })
        .catch((e) => {
          console.log(e);
          reject();
        });
    });
  }
}

Post.fetchingQuery = (addingOps) => {
  return new Promise(async (resolve, reject) => {
    try {
      let ops = [
        ...addingOps,
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "postDoc",
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            body: 1,
            createdDate: 1,
            author: { $arrayElemAt: ["$postDoc", 0] },
          },
        },
        { $sort: { createdDate: -1 } },
      ];
      let posts = await postsCollection.aggregate(ops).toArray();
      posts = posts.map((post) => {
        post.author = {
          _id: post.author._id,
          username: post.author.username,
          avatar: new User({ email: post.author.email }).getAvatar(),
        };
        return post;
      });
      resolve(posts);
    } catch (e) {
      reject(e);
    }
  });
};

Post.fetchPostsByAuthor = (id) => {
  return new Promise(async (resolve, reject) => {
    let posts = await Post.fetchingQuery([{ $match: { authorId: id } }]);
    resolve(posts);
  });
};

Post.fetchSinglePost = (postId, visitorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // postId should be a string not a ObjectID
      let post = await Post.fetchingQuery([
        { $match: { _id: new ObjectID(postId) } },
      ]);
      let isVisitorOwner = post[0].author._id.equals(visitorId);
      post = { ...post[0], isVisitorOwner: isVisitorOwner };
      resolve(post);
    } catch (e) {
      reject(e);
    }
  });
};

Post.delete = (postId) => {
  return new Promise((resolve, reject) => {
    postsCollection
      .deleteOne({ _id: postId })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

Post.postsCount = (id) => {
  return new Promise(async (resolve, reject) => {
    let count = await postsCollection.countDocuments({ authorId: id });
    resolve(count);
  });
};

Post.searchByText = (text) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await postsCollection.aggregate([
        {
          $match: { $text: { $search: text } },
        },
      ]);
      resolve(await posts.toArray());
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = Post;
