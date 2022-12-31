const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

require('dotenv').config()

let _db;
const connectionString = process.env.DB_CONNECTION_STRING

const mongoConnect = (callback) => {
    MongoClient.connect(connectionString)
        .then(client => {
            console.log('Connected Database...');
            _db = client.db();
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getdb = () => {
    if(_db) {
        return _db;
    }
    throw 'Veri Tabanı Yok';
}
// exports.mongoConnect = mongoConnect;
exports.getdb = getdb;