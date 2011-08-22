var sys = require("sys");
var mongoose = require("mongoose");
var config = require("./config");

// Assemble our connection details from config.js
var loginCredentials = config.username + ':' + config.password;
var dbUrl = config.databaseUrl;
var dbName = config.databaseName;

// Connect to the MongoLab database
mongoose.connect("mongodb://" + loginCredentials + "@" + dbUrl + "/" + dbName);

/**
 * Queries a collection to retrieve data based on
 * properties supplied by @json
 * 
 * @param {string} collectionIdent Identifier for the collection
 * @param {JSON} json Hash of details to query against
 * @param {function} callback Callback to return to
 */
function query (collectionIdent, json, callback) {
    mongoose.connection.db.collection(collectionIdent, function (err, collection) {
        collection.find(json).toArray(callback);
    });
}

/**
 * Inserts data into a collection
 * 
 * @param {string} collectionIdent Identifier for the collection
 * @param {JSON} data Data to insert into the collection
 * @param {function} callback Callback to return to
 */
function insert (collectionIdent, data, callback) {
    mongoose.connection.db.collection(collectionIdent, function (err, collection) {
        collection.insert(data, callback);
    });
}

// Detect the connection "open" event
mongoose.connection.on("open", function() {
    console.log("Connected!");

    // Create some fake location details to insert
    var fakeLocation = {
        name : "Compton",
        location : {
            lat : 33.899629,
            long : -118.22053
        }
    };
    
    insert("locations", fakeLocation, function(err) {
        if (err) {
            console.log(err);
            return;
        }

        // Query for all locations (note empty JSON in 2nd parameter)
        query("locations", {}, function (err, docs) {
            if (err) {
                console.log("Query error", err);
                return;
            }

            // Spit out the results and disconnect
            console.log("Query Result(s):", docs);
            mongoose.disconnect();
        });
    });
});