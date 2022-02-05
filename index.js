var express = require('express');
var app = express();
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krqaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect()
        // console.log('db connected');

        const database = client.db('waterloo');
        const packagesCollection = database.collection('packages')
        const bookedTicket = database.collection('booking')


        // get api for packages
        app.get('/packages', async (req, res) => {
            const result = await packagesCollection.find({}).toArray()
            res.send(result)
        })

        //get single package details
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) }
            const package = await packagesCollection.findOne(query);
            res.send(package)
        })

        // book ticket api
        app.post('/bookticket', async (req, res) => {
            const bookticket = req.body;
            const result = await bookedTicket.insertOne(bookticket);
            res.send(result)
        })

    }
    finally {

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("hello from server watreloo");
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})