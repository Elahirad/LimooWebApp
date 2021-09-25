const User = require('../models/User');
const {ObjectID} = require("mongodb");
const followsCollection = require('../db').db().collection('follows');
class Follow {
    constructor(data) {
        this.data = data;
        this.errors = [];
    }

    validate(op) {
        return new Promise(async (resolve, reject) => {
            let user = await User.searchByUsername(this.data.followedUsername);
            if (!user) this.errors.push("This user doesn't exists !");
            this.data = {
                followedId: user._id,
                followerId: new ObjectID(this.data.followerId)
            }
            let follow = await followsCollection.findOne(this.data);
            if (op==='1') {
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
        let follow = await followsCollection.findOne({ followedId: user._id, followerId: new ObjectID(visitor) });
        if (follow) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
};

Follow.followingCount = (username) => {
    return new Promise(async (resolve, reject)  => {
        let user = await User.searchByUsername(username);
        let followingsCount = followsCollection.countDocuments({ followerId: user._id });
        resolve(followingsCount);
    });
};

Follow.followerCount = (username) => {
    return new Promise(async (resolve, reject)  => {
        let user = await User.searchByUsername(username);
        let followersCount = followsCollection.countDocuments({ followedId: user._id });
        resolve(followersCount);
    });
};

module.exports = Follow;