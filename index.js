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
    const blogCollection = database.collection("blogs");
    const userInfoCollection = database.collection("userInfo");

    // GET API for blogs data
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const blog = await cursor.toArray();
      res.send(blog);
    });

    // GET API for find multiple destinations data.
    app.get("/destinations", async (req, res) => {
      const cursor = destinationCollection.find({});
      const destinations = await cursor.toArray();
      res.send(destinations);
    });

    // GET API for find single destination data.
    app.get("/destinations/:destinationId", async (req, res) => {
      const id = req.params.destinationId;
      const query = { _id: ObjectId(id) };
      const singleDestination = await destinationCollection.findOne(query);
      res.send(singleDestination);
    });

    // GET API for find users info/my cart data
    app.get("/usersinfo/:uid", async (req, res) => {
      const id = req.params.uid;
      const query = { _id: ObjectId(id) };
      const singleReservation = await userInfoCollection.findOne(query);
      res.send(singleReservation);
    });

    // my cart/users info data filtering
    app.get("/usersinfo", async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        query = { email: email };
      }
      const cursor = userInfoCollection.find(query);
      const myCart = await cursor.toArray();
      res.send(myCart);
    });

    // POST API for create single destination data
    app.post("/usersinfo", async (req, res) => {
      const user = req.body;
      const singleDestination = await userInfoCollection.insertOne(user);
      res.json(singleDestination);
    });

    // GET API for create multiple data.
    app.get("/usersinfo", async (req, res) => {
      const cursor = userInfoCollection.find({});
      const usersInfo = await cursor.toArray();
      res.send(usersInfo);
    });

    // POST API for create single data
    app.post("/destinations", async (req, res) => {
      const destination = req.body;
      const singleDestination = await destinationCollection.insertOne(
        destination
      );
      res.json(singleDestination);
    });

    //PUT APT to update status data
    app.put("/usersinfo/:uid", async (req, res) => {
      const id = req.params.uid;
      const updateStatus = "accepted";
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updateStatus,
        },
      };
      const updatedDestination = await userInfoCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(updatedDestination);
    });

    // delete api
    app.delete("/destinations/:destinationId", async (req, res) => {
      const id = req.params.destinationId;
      const query = { _id: ObjectId(id) };
      const deleteDestination = await destinationCollection.deleteOne(query);
      res.send(deleteDestination);
    });

    app.delete("/usersinfo/:uid", async (req, res) => {
      const id = req.params.uid;
      const query = { _id: ObjectId(id) };
      const deleteReservation = await userInfoCollection.deleteOne(query);
      res.send(deleteReservation);
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
