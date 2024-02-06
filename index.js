const express = require('express')
// Importing required functions from dbConnection.cjs
const {connectToDb, getDb} = require('./db.js')
const {ObjectId}=require("mongodb")
const app = express()

app.use(express.json())

let db
connectToDb(function(error) {
    if(error) {
        console.log('Could not establish connection...')
        console.log(error)
    } else {
        port=process.env.PORT ||3000
        app.listen(port)
        db = getDb()
        console.log('Listening on port 3000...')
    }
})


app.post('/add-entry', function(request, response) {
    db.collection('expenseDetails').insertOne(request.body).then(function() {
        response.status(201).json({
            "status" : "Entry added successfully"
        })
    }).catch(function (err) {
        console.log(err)
        response.status(500).json({
            "status" : "Entry not added"
        })
    })
})

app.get('/display-entry',function(request, response){
    let entries=[];
    db.collection('expenseDetails').find().forEach((element) => {
        entries.push(element);
    }).then(()=>{
        response.status(200).json(entries)
    }).catch(()=>{
        response.status(500).json({
            "status" : "Entry not found"
        })
    })
    
})

app.delete('/delete-entry', function(request, response) {
    if(ObjectId.isValid(request.query.id)) {
        db.collection('expenseDetails').deleteOne({
            _id : new ObjectId(request.query.id)
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})

app.patch('/update-entry/:id', function(request, response) {
    if(ObjectId.isValid(request.params.id)) {
        db.collection('expenseDetails').updateOne(
            { _id : new ObjectId(request.params.id) }, // identifier : selecting the document which we are going to update
            { $set : request.body } // The data to be updated
        ).then(function() {
            response.status(200).json({
                "status" : "Entry updated successfully"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Unsuccessful on updating the entry"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})