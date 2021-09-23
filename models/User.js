const validator = require('validator');

class User {
    constructor(data) {
        this.data = data;
        this.errors = [];
    }

    cleanUp() {
        // Cleaning up inputs
        if (typeof (this.data.username) != "string") this.data.username = "";
        if (typeof (this.data.email) != "string") this.data.email = "";
        if (typeof (this.data.password) != "string") this.data.password = "";
    }

    validate() {
        // Username validation
        if (this.data.username === "") this.errors.push("You must provide a username !");
        if (this.data.username.length < 3) this.errors.push("Username must be at least 3 chars !");
        if (this.data.username.length > 10) this.errors.push("Username can be maximum 10 chars !");

        // Email Validation
        if (this.data.email === "" || !validator.isEmail(this.data.email)) this.errors.push("You must provide a valid email address !");

        // Password Validation
        if (this.data.password === "") this.errors.push("You must provide a password !");
        if (this.data.password.length < 12) this.errors.push("Password must be at least 12 chars !");
        if (this.data.password.length > 50) this.errors.push("Password can be maximum 50 chars !");

    }

    register() {
        return new Promise((resolve,reject) => {
            this.cleanUp();
            this.validate();
            if (this.errors.length){
                reject(this.errors);
            } else {
                resolve();
            }
        })

    }
}

module.exports = User;