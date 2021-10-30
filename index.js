const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nklmu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        console.log("Connected To Db");
        const database = client.db('Travel_Now');
        const packageCollection = database.collection('Places')
        const selectedCollection = database.collection('selected_pack')


        // add data to cart collection with additional info
        app.post("/packages/add", async (req, res) => {
            const package = req.body;
            const result = await packageCollection.insertOne(package);
            res.json(result);
        });

        //GET Full API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })
        //GET selected Full API
        app.get('/pack', async (req, res) => {
            const cursor = selectedCollection.find({});
            const package = await cursor.toArray();
            res.send(package);
        })
        // Get Single Item
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await packageCollection.findOne(query);
            res.json(service)
        });


        //// load added data according to user id get api
        app.get("/package/:uid", async (req, res) => {
            const uid = req.params.uid;
            const query = { uid: uid };
            const result = await selectedCollection.find(query).toArray();
            res.json(result);
        });
        // add data to cart collection with additional info
        app.post("/pack/add", async (req, res) => {
            const package = req.body;
            const result = await selectedCollection.insertOne(package);
            res.json(result);
        });

        // delete data from cart delete api
        app.delete("/pack/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: (id) };
            const result = await selectedCollection.deleteOne(query);
            res.json(result);
        });



    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Hello From Travel-Tour Server!')
})

app.listen(port, () => {
    console.log(`Server Running At : ${port}`)
})