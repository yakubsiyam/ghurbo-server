const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//ghurodb
//a8l60RQMciyrZNIo

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cgvvx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("ghurbo");
    const destinationCollection = database.collection("destination");

    // GET API for find multiple data.
    app.get("/destinations", async (req, res) => {
      const cursor = destinationCollection.find({});
      const destinations = await cursor.toArray();
      res.send(destinations);
    });

    // GET API for find single data.
    app.get("/destinations/:destinationId", async (req, res) => {
      const id = req.params.destinationId;
      const query = { _id: ObjectId(id) };
      const singleDestination = await destinationCollection.findOne(query);
      res.send(singleDestination);
    });

    // POST API for create single data
    app.post("/destination", async (req, res) => {
      const destination = req.body;
      const singleDestination = await destinationCollection.insertOne(service);
      res.json(singleDestination);
    });

    //PUT APT to update single data

    app.put("/update/:id", async (req, res) => {
      const id = req.params.destinationId;
      const updateDestination = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: updateDestination.title,
          cost: updateDestination.cost,
        },
      };
      const updatedDestination = await destinationCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(updatedDestination);
    });

    // delete api
    app.delete("/destinations/:destinationId", async (req, res) => {
      const id = req.params.destinationId;
      const query = { _id: ObjectId(id) };
      const deleteDestination = await destinationCollection.deleteOne(query);
      res.send(deleteDestination);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ghurbo Working.....");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
