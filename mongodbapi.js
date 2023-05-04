const { MongoClient } = require('mongodb');

// Connection URI for MongoDB
const mongodbUri = 'mongodb://localhost:27017';

// Database name
const dbName = 'newsstack';

// Create a new MongoClient
const mongodbClient = new MongoClient(mongodbUri);

var mongodbconnected = false;
var userscollection = null;

function isMongoDBConnected() {
    return mongodbconnected;
}

function connectMongoDB() {
    try {
        // Connect to the MongoDB server
        mongodbClient.connect();
    
        // Get a reference to the "newsstack" database
        const db = mongodbClient.db(dbName);
    
        // Create a new "users" collection
        userscollection = db.collection('users');
        mongodbconnected = true;
    } catch (error) {
        mongodbconnected = false;
    }
}

function closeMongoDBConnection() {
    // Close the client connection
    mongodbClient.close();
    mongodbconnected = false;
}

function isUserExisting(sub) {
    
}

function getUserData(sub) {
    
}

function updateUserData(sub, usr_data) {
    
}

function createUser(sub, usr_data) {
    try {
        // Insert a new document into the "users" collection
        const result =  userscollection.insertOne({
          sub: sub,
          'user-data': usr_data,
          'ns-data': null,
        });
    
        console.log(`Document created with ID ${result.insertedId}`);
      } catch (err) {
        console.error(err);
      } 
}

function getNewsStacks(sub) {
    
}

function updateNewsStacks(sub, ns_data) {
    
}