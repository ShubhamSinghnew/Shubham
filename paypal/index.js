


const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const uri = "mongodb+srv://admin:admin@cluster0.fit8mu3.mongodb.net/test";
const client = new MongoClient(uri, { useNewUrlParser: true });


app.get('/', (req, res) => {
    client.connect(err => {
    const collection = client.db("test").collection("orders");
    //find method
   
    collection.find({Customer_Phoneno:req.params.Customer_Phoneno}).toArray(function(err, result) {
        var tableHtml = '<table border="1" style="width:100%"><tr><th>Device ID</th><th>Device Name</th></tr>';
        result.forEach(function(item) {
            tableHtml += '<tr><td>'+item.Customer_Phoneno+'</td><td>'+item.Customer_Address
            +'</td></tr>';
        });
        tableHtml += '</table>';
        res.send(`<html><body>${tableHtml}</body></html>`);
        client.close();
        
    });         
    });
});




app.listen(3000, () => {
    console.log('Server running on port 3000');
});

