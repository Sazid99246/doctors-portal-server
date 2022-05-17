const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.92qnf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const servicesCollection = client.db("doctors_portal").collection("services")
        const bookingsCollection = client.db("doctors_portal").collection("bookings")

        app.get('/service', async(req, res) =>{
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        /**
         * API Naming Convention 
         * app.get('/booking') // get all bookings in this collection, or get more than one or by filter.
         * app.get('/boooking/:id') // get a specific booking
         * app.post('/booking') // add a new booking
         * app.patch('/booking/:id') // update a sepcific booking
         * app.delete('/booking/:id') // delete a specific booking
        */
       app.post('/booking', async (req, res)=>{
           const booking = req.body;
           const result = bookingsCollection.insertOne(booking);
           res.send(result);
       })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from doctor uncle')
})
app.listen(port, () => {
    console.log('Doctors Portal listening on port', port);
})