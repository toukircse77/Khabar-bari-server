const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
app.use(cors());
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(express.json());
 




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p9ygaby.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const userCollectin = client.db("foods").collection("items");
        const allReviewsCollectin = client.db("foods").collection("reviewses");
        app.post('/AllReview', async (req, res) =>{
            const review = req.body; 
            const result = await allReviewsCollectin.insertOne(review);
            console.log(result);
            res.send(result);
        })

     

        app.get('/all-review', async (req, res) => {
            let query = {};
            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }
            const cursor = allReviewsCollectin.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/all-reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = allReviewsCollectin.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/all-reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await allReviewsCollectin.findOne(query);
            res.send(result);
        })

        app.delete('/all-reviews/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectId(id) };
            const userDelete = await allReviewsCollectin.deleteOne(query);
            res.send(userDelete);

        })
        

        app.get('/items', async (req, res) => {
            const quary = {};
            const cursor = userCollectin.find(quary).limit(3);
            const services = await cursor.toArray();
            res.send(services)
        })
        app.get('/services', async (req, res) => {
            const quary = {};
            const cursor = userCollectin.find(quary);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.post('/services', async (req, res) => {
            const newservices = req.body;
            const result = await userCollectin.insertOne(newservices);
            console.log(result)
            res.send(result);
        })
        
        app.get('/serviceDetails/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const serviceDatails = await userCollectin.findOne(quary)
            res.send(serviceDatails);
        })
    }
    finally {

    }
}
run().catch(err => console.error(err));








app.get('/', (req, res) => {
    res.send('testing  server is running');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})