const User = require('../models/User');
const {ObjectID} = require("mongodb");
const followsCollection = require('../db').db().collection('follows');

class Follow {
    constructor(data, visitorId) {
        this.data = data;
        this.errors = [];
        this.visitorId = visitorId;
    }

    validate(op) {
        return new Promise(async (resolve, reject) => {
            let user = await User.searchByUsername(this.data.followedUsername,this.visitorId);
            if (user._id.equals(this.data.followerId)) this.errors.push("You can not follow yourself !");
            if (!user) this.errors.push("This user doesn't exists !");
            this.data = {
                followedId: user._id,
                followerId: new ObjectID(this.data.followerId)
            }
            let follow = await followsCollection.findOne(this.data);
            if (op === '1') {
                if (follow) this.errors.push("You already followed this user !");
            }
            if (op === '2') {
                if (!follow) this.errors.push("You are not following this user !");
            }

            resolve();
        });
    }

    create() {
        return new Promise(async (resolve, reject) => {
            await this.validate('1');
            if (this.errors.length) {
                reject(this.errors);
            } else {
                await followsCollection.insertOne(this.data);
                resolve();
            }
        });
    }

    remove() {
        return new Promise(async (resolve, reject) => {
            await this.validate('2');
            if (this.errors.length) {
                reject(this.errors);
            } else {
                await followsCollection.deleteOne(this.data);
                resolve();
            }
        });
    }

}

// This is for checking if visitor followed
Follow.checkFollowing = (followed, visitor) => {
    return new Promise(async (resolve, reject) => {
        let user = await User.searchByUsername(followed);
        let follow = await followsCollection.findOne({followedId: user._id, followerId: new ObjectID(visitor)});
        if (follow) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
};

Follow.followingCount = (id) => {
    return new Promise(async (resolve, reject) => {
        let followingsCount = followsCollection.countDocuments({followerId: id});
        resolve(followingsCount);
    });
};

Follow.followerCount = (id) => {
    return new Promise(async (resolve, reject) => {
        let followersCount = followsCollection.countDocuments({followedId: id});
        resolve(followersCount);
    });
};

Follow.fetchFollowers = (id) => {
    return new Promise(async (resolve, reject) => {
        let follows = await followsCollection.aggregate([
            {$match: {followedId: id}},
            {$lookup: {from: "users", localField: "followerId", foreignField: "_id", as: "followersDoc"}},
            {
                $project: {
                    follower: {$arrayElemAt: ["$followersDoc", 0]}
                }
            }
        ]).toArray();
        let followers = follows.map(follow => {
            follow = {
                username: follow.follower.username,
                _id: follow.follower._id,
                avatar: new User({email: follow.follower.email}).getAvatar()
            }
            return follow;
        });
        resolve(followers);
    });
};

Follow.fetchFollowings = (id) => {
    return new Promise(async (resolve, reject) => {
        let follows = await followsCollection.aggregate([
            {$match: {followerId: id}},
            {$lookup: {from: "users", localField: "followedId", foreignField: "_id", as: "followingsDoc"}},
            {
                $project: {
                    following: {$arrayElemAt: ["$followingsDoc", 0]}
                }
            }
        ]).toArray();
        let followings = follows.map(follow => {
            follow = {
                username: follow.following.username,
                _id: follow.following._id,
                avatar: new User({email: follow.following.email}).getAvatar()
            }
            return follow;
        });
        resolve(followings);
    });
};

module.exports = Follow;