/****************************************************************************** *** 
*	ITE5315 – Assignment 4 
*	I declare that this assignment is my own work in accordance with Humber Academic Policy.   *  No part of this assignment has been copied manually or electronically from any other source *  (including web sites) or distributed to other students. 
*  
*	Name: __shrutiben italiya__ Student ID: _N01579444___ Date: _27/03/2024___________________ 
* 
* 
******************************************************************************
**/  

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';

function findAll() {
    return new Promise(async (resolve, reject) => {
        let client;
        try {
            client = await MongoClient.connect(url);
            const db = client.db("mydb");
            const collection = db.collection('customers');
            const cursor = collection.find({}).limit(4);

            const docs = [];
            await cursor.forEach(doc => {
                docs.push(doc);
            });
            resolve(docs);
        } catch (err) {
            reject(err);
        } finally {
            if (client) {
                client.close();
            }
        }
    });
}

setTimeout(() => {
    findAll()
        .then(docs => {
            console.log("data",docs);
        })
        .catch(err => {
            console.log(err);
        });
    console.log('iter');
}, 5000);
