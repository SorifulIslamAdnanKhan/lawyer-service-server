const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const jwt = require('jsonwebtoken');

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
        const reviewCollection = client.db("lawService").collection("review");

        // insert service to database 
        app.post('/service', async(req, res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        // get home services data
        app.get('/services', async(req, res)=>{
            const query = {};
            const data = await serviceCollection.find(query).limit(3).toArray();
            res.send(data)
        });

        // get all service data
        app.get('/all-services', async(req, res)=>{
            const query = {};
            const data = await serviceCollection.find(query).toArray();
            res.send(data)
        });

        // get single service details

        app.get('/all-services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // insert review to database 
        app.post('/add-review', async(req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.send(result);
        });

        // get all reviews data
        app.get('/reviews', async(req, res)=>{
            const query = {};
            const data = await reviewCollection.find(query).toArray();
            res.send(data)
        });

        // get reviews based on service
        app.get('/reviews/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {serviceID:id};
            const reviews = await reviewCollection.find(query).toArray();
            res.send(reviews);
        });

        app.get('/my-reviews', async(req, res)=>{
            
            // const decoded = req.decoded;
            
            // if(decoded.email !== req.query.email){
            //     res.status(403).send({message: 'Unauthorized Access'})
            // }

            let query = {};
           

            if(req.query.email){
                query= {
                    email: req.query.email
                }
            }
 
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.delete('/reviews/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });

        app.post('/jwt', async(req, res)=>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '1d'})
            res.send({token})
        })

    } finally {
        
    }
}

run().catch(err=>console.log(err));

app.get('/', (req, res) => {
    res.send('AKL Lawyer Service Running');
});

app.listen(port, () => {

});