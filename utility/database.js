const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://localhost/node-app')
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