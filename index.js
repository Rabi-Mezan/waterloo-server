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
        const bookedTicket = database.collection('booking');
        const usersCollection = database.collection('user')


        // add packages api
        app.post('/packages', async (req, res) => {
            const packages = req.body;
            const result = await packagesCollection.insertOne(packages)
            console.log(result);
            res.json(result);
        })

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
        app.post('/bookTicket', async (req, res) => {
            const bookticket = req.body;
            const result = await bookedTicket.insertOne(bookticket);
            res.send(result)
        })

        //mybooking api
        app.get('/mybooking/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await bookedTicket.find(query).toArray();
            res.json(result)

        })
        //all booking api
        app.get('/booking', async (req, res) => {
            const result = await bookedTicket.find({}).toArray();
            res.json(result)

        })

        //cancel ticket api
        app.delete('/mybooking/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookedTicket.deleteOne(query)
            res.send(result)
        })

        // post api for users
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })


        // admin cheking api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })


        //status update api for booking
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: "Approved"
                },
            };
            const result = await bookedTicket.updateOne(filter, updateDoc)
            res.send(result)
            console.log(result);
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