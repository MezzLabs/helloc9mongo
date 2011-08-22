var sys = require("sys");
var mongoose = require("mongoose");
var config = require("./config");

var loginCredentials = config.username + ':' + config.password;
var dbUrl = config.databaseUrl;
var dbName = config.databaseName;

mongoose.connect("mongodb://" + loginCredentials + "@" + dbUrl + "/" + dbName);

function find (collectionIdent, query, callback) {
    mongoose.connection.db.collection(collectionIdent, function (err, collection) {
        collection.find(query).toArray(callback);
    });
}

mongoose.connection.on("open", function() {
    console.log("connected");
    find('checkins', {}, function (err, docs) {
        console.log(docs);
        mongoose.disconnect();
    });
});