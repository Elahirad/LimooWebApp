const validator = require('validator');
const userCollection = require('../db').db().collection('users')
const bcrypt = require('bcryptjs');
const md5 = require('md5');

class User {
    constructor(data, getsAvatar) {
        this.data = data;
        this.errors = [];
        this.getsAvatar = getsAvatar;
        this.avatar = "";
    }

    cleanUp() {
        // Cleaning up inputs
        if (typeof (this.data.username) != "string") this.data.username = "";
        if (typeof (this.data.email) != "string") this.data.email = "";
        if (typeof (this.data.password) != "string") this.data.password = "";
        if (this.getsAvatar !== undefined) this.getAvatar();
    }

    validate() {
        return new Promise(async (resolve, reject) => {
            // Username validation
            if (this.data.username === "" || !validator.isAlphanumeric(this.data.username)) this.errors.push("You must provide a username !");
            if (this.data.username.length < 3) this.errors.push("Username must be at least 3 chars !");
            if (this.data.username.length > 10) this.errors.push("Username can be maximum 10 chars !");

            // Email Validation
            if (this.data.email === "" || !validator.isEmail(this.data.email)) this.errors.push("You must provide a valid email address !");

            // Password Validation
            if (this.data.password === "") this.errors.push("You must provide a password !");
            if (this.data.password.length < 12) this.errors.push("Password must be at least 12 chars !");
            if (this.data.password.length > 50) this.errors.push("Password can be maximum 50 chars !");

            // Picking up data that we need
            this.data = {
                username: this.data.username,
                password: this.data.password,
                email: this.data.email
            };
            if (await this.doesUsernameExist()) this.errors.push("This username is already taken !");
            if (await this.doesEmailExist()) this.errors.push("This email is already taken !");
            resolve();
        });
    }

    register() {
        return new Promise(async (resolve, reject) => {
            this.cleanUp();
            await this.validate();
            console.log(this.errors);
            if (this.errors.length) {
                reject(this.errors);
            } else {
                // Password should be hashed using bcryptjs module
                let salt = bcrypt.genSaltSync(10);
                userCollection.insertOne({
                    username: this.data.username,
                    email: this.data.email,
                    password: bcrypt.hashSync(this.data.password, salt)
                }).then(info => {
                    // Resolving registered user's _id
                    resolve(info.insertedId);
                }).catch(e => {
                    reject(e)
                });
                resolve();
            }
        })

    }

    login() {
        return new Promise((resolve, reject) => {
            this.cleanUp();
            userCollection.findOne({username: this.data.username}).then(user => {
                // Using bcryptjs to compare string with hash
                if (bcrypt.compareSync(this.data.password, user.password)) {
                    resolve(user);
                } else {
                    reject("Invalid username/password !")
                }
            }).catch(() => {
                reject("Invalid username/password !");
            })
        })
    }

    getAvatar() {
        this.avatar = `https://s.gravatar.com/avatar/${md5(this.data.email)}?s=128`
    }

    doesEmailExist() {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await userCollection.findOne({ email: this.data.email });
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (e) {
                reject(e);
            }

        });
    }

    doesUsernameExist() {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await userCollection.findOne({ username: this.data.username });
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (e) {
                reject(e);
            }

        });
    }

}

module.exports = User;