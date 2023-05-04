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
    return userscollection.findOne({ sub: sub });
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
    const filter = { sub: sub };
    const user = userscollection.findOne(filter);

    if (user) {
        const ns_data = user['ns-data'];
        return ns_data;
    } else {
        console.log('User with sub ' + sub + ' not found');
    }

    return null;
}

function updateNewsStacks(sub, ns_data) {
    const filter = { sub: sub };
    const update = { $set: { 'ns-data': ns_data } };

    const result = userscollection.updateOne(filter, update);

    if (result.modifiedCount === 1) {
        console.log('ns-data field updated for user with sub ' + sub);
    } else {
        console.log('Error: User with sub ' + sub + ' not found');
    }
}


function getUserData(sub) {
    const filter = { sub: sub };
    const user = userscollection.findOne(filter);

    if (user) {
        const user_data = user['user-data'];
        return user_data;
    } else {
        console.log('User with sub ' + sub + ' not found');
    }

    return null;
}


function updateUserData(sub, user_data) {
    const filter = { sub: sub };
    const update = { $set: { 'user-data': user_data } };

    const result = userscollection.updateOne(filter, update);

    if (result.modifiedCount === 1) {
        console.log('user-data field updated for user with sub ' + sub);
    } else {
        console.log('Error: User with sub ' + sub + ' not found');
    }
}