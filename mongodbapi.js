const { MongoClient } = require('mongodb');

// Connection URI for MongoDB
const mongodbUri = 'mongodb://localhost:27017';

// Database name
const dbName = 'newsstack';

// Create a new MongoClient
const mongodbClient = new MongoClient(mongodbUri);

var mongodbconnected = false;
var userscollection = null;

connectMongoDB();

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

        console.log("Connected to MongoDB", mongodbUri)
    } catch (error) {
        console.error("ERROR: Could not connect to MongoDB", mongodbUri, dbName, error)
        mongodbconnected = false;
    }
}

function closeMongoDBConnection() {
    // Close the client connection
    mongodbClient.close();
    mongodbconnected = false;
}

async function isUserExisting(sub) {
    const result = await userscollection.findOne({ _id: sub })

    if (result) {
        console.log("isUserExisting: found user")
        return true;
    } else {
        console.log("isUserExisting: did not find user")
        return false;
    }
}

async function createUser(sub, usr_data) {
    const currentDate = new Date();
    console.log("creating new user")
    try {
        // Insert a new document into the "users" collection
        const result = await userscollection.insertOne({
            _id: sub,
            lastLogin: currentDate.toString(),
            'user-data': usr_data,
            'ns-data': null,
        });
    
        console.log(`Document created with ID ${result.insertedId}`);
      } catch (err) {
        console.error(err);
      } 
}

async function getNewsStacks(sub) {
    const filter = { _id: sub };
    const user = await userscollection.findOne(filter);
    
    if (user) {
        const ns_data = user['ns-data'];
        return ns_data;
    } else {
        console.log('User with sub ' + sub + ' not found');
    }

    return null;
}

async function updateNewsStacks(sub, ns_data) {
    const filter = { _id: sub };
    const update = { $set: { 'ns-data': ns_data } };

    const result = await userscollection.updateOne(filter, update);

    if (result.modifiedCount === 1) {
        console.log('ns-data field updated for user with sub ' + sub);
    } else {
        console.log('Error: User with sub ' + sub + ' not found');
    }
}


async function getUserData(sub) {
    const filter = { _id: sub };
    const user = await userscollection.findOne(filter);

    if (user) {
        const user_data = user['user-data'];
        return user_data;
    } else {
        console.log('User with sub ' + sub + ' not found');
    }

    return null;
}


async function updateUserData(sub, user_data) {
    if (await isUserExisting(sub)) {
        await createUser(sub, user_data);
    }
    else {
        const filter = { _id: sub };
        const update = { $set: { 'user-data': user_data } };

        const result = await userscollection.updateOne(filter, update);

        if (result.modifiedCount === 1) {
            console.log('user-data field updated for user with sub ' + sub);
        } else {
            console.log('Error: User with sub ' + sub + ' not found');
        }
    }
}

async function updateLastLogin(sub) {
    const currentDate = new Date();
    const filter = { _id: sub };
    const update = { $set: { lastLogin: currentDate.toString() } };

    const result = await userscollection.updateOne(filter, update);

    if (result.modifiedCount === 1) {
        console.log('lastLogin field updated for user with sub ' + sub);
    } else {
        console.log('Error: User with sub ' + sub + ' not found');
    }
}


module.exports = { updateUserData, updateNewsStacks, updateLastLogin, getNewsStacks, isUserExisting, createUser };
