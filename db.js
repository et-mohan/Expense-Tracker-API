const {MongoClient} = require('mongodb')

let dbConnection
function connectToDb(callBack) {
    MongoClient.connect('mongodb+srv://admin:Rro7jdT9cTJqZVP3@cluster0.oz3zdy2.mongodb.net/?retryWrites=true&w=majority').then(function(client) {
        dbConnection = client.db()
        callBack()
    }).catch(function(error) {
        callBack(error)
    })
}

function getDb() {
    return dbConnection
} 

// Exporting required functions
module.exports = {connectToDb, getDb}