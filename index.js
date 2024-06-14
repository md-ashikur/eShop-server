const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();


app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE_URL;
  

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("user");
    const userCollection = database.collection("userCollection");


    // post product----------
    app.post("/users", async (req, res) => {
      const userData = req.body;

      const result = await userCollection.insertOne(userData);
      res.send(result);
    });

    // get product----------
    app.get("/users", async (req, res) => {
        const usersData = userCollection.find();
        const result = await usersData.toArray();
        res.send(result);
      });


      app.delete("/users/:id", async (req, res) => {
        const id = req.params.id;
        const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      });



    await client.db("admin").command({ ping: 1 });
    console.log("connect");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("workings");
});

app.listen(port, (req, res) => {
  console.log("listening on port :", port);
});