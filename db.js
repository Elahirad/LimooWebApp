const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

let client = new MongoClient(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect().then(resClient => {
    module.exports = resClient;
    console.log("Conncted to database !");
    require('./app').listen(process.env.PORT);
    console.log(`Listening on Port ${process.env.PORT}`);
}).catch(e => {
    console.log("ERR!!");
    console.log(e);
})