const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();
require('dotenv').config();

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3aa5vlu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const serviceCollection = client.db("lawService").collection("service");
        
        // insert service to database 
        app.post('/service', async(req, res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.send(result);
        })

        // get home services data
        app.get('/services', async(req, res)=>{
            const query = {};
            const data = await serviceCollection.find(query).limit(3).toArray();
            res.send(data)
        })

        // get all service data
        app.get('/all-services', async(req, res)=>{
            const query = {};
            const data = await serviceCollection.find(query).toArray();
            res.send(data)
        })

        // get signe service details

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

    } finally {
        
    }
}

run().catch(err=>console.log(err));

app.get('/', (req, res) => {
    res.send('AKL Lawyer Service Running');
});

app.listen(port, () => {

});