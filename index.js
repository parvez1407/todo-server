const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middle ware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktnfrsc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const usersCollections = client.db('toDo').collection('users');
        const tasksCollection = client.db('toDo').collection('tasks');


        // user collection api
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: user,
            }
            const result = await usersCollections.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // post tasks objects to database
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
        })
        // get Tasks of specific user
        app.get('/tasks/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })

        // task completed
        app.post('/completed/:id', async (req, res) => {
            const complete = req.body;
            const id = complete.id;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    complete: true,
                }
            }
            const updatedProducts = await tasksCollection.updateMany(filter, updatedDoc);
            // const updatedResult = await usersCollections.updateOne({ email: complete.email }, updatedDoc);

        })
        // task incomplete
        app.post('/incomplete/:id', async (req, res) => {
            const complete = req.body;
            const id = complete.id;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    complete: false,
                }
            }
            const updatedProducts = await tasksCollection.updateMany(filter, updatedDoc);
            // const updatedResult = await usersCollections.updateOne({ email: complete.email }, updatedDoc);

        })

        // delete task
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(filter);
            res.send(result);
        })
        // update task get
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await tasksCollection.findOne(filter);
            res.send(result);
        })

        // update task Edit
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            // const option = { upsert: true };
            const updatedEdit = {
                $set: {
                    taskName: review.taskName,
                    description: review.description
                }
            }
            const result = await tasksCollection.updateOne(filter, updatedEdit);
            res.send(result);
        })

        // app.put('/comments/:id', async (req, res) => {
        //     const commentId = req.body;
        //     const id = commentId.id;
        //     const filter = { _id: ObjectId(id) };
        //     const comment = req.body;
        //     const comm = comment.comm
        //     const updatedDoc = {
        //         $set: {
        //             comment: comm
        //         }
        //     }
        //     const updatedResult = await tasksCollection.updateOne(filter, updatedDoc);
        // })
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', async (req, res) => {
    res.send('To-Do server is running');
})

app.listen(port, () => {
    console.log(`To-Do is running on port ${port}`);
})