/****************************************************************************** *** 
*	ITE5315 – Assignment 4 
*	I declare that this assignment is my own work in accordance with Humber Academic Policy.   *  No part of this assignment has been copied manually or electronically from any other source *  (including web sites) or distributed to other students. 
*  
*	Name: __shrutiben italiya__ Student ID: _N01579444___ Date: _27/03/2024___________________ 
* 
* 
******************************************************************************
**/  
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

 function findAll() {
    
    const client =  MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log("s2");console.log(err); });
    if (!client) return;
        
    try {
        console.log('1');
        const db =  client.db("mydb");
        console.log('2');
        let collection =  db.collection('customers');
        console.log('3');
        let cursor =  collection.find({}).limit(10);
        console.log('4');
         cursor.forEach(doc => console.log(doc));
        console.log('5');
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}
setTimeout(()=>{
    findAll();
    console.log('iter');
}, 5000);