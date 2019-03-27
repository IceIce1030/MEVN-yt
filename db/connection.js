const monk = require('monk');
const connectionString = process.env.MONGODB_URI || 'localhost:27017/mydb';
console.log('connectionString=>', connectionString);
const db = monk(connectionString);

module.exports = db;