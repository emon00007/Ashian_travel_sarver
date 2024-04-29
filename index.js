const express=require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.x8jkuyh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristSpotCollection= client.db('addTouristSpotDB').collection('addTouristSpot')
    app.post('/addTouristSpot',async(req,res)=>{
        const newAddTouristSpot =req.body 
        console.log(newAddTouristSpot)
        const result =await touristSpotCollection.insertOne(newAddTouristSpot)
        res.send(result)
    })



    app.get('/myList/:email',async(req,res)=>{
        console.log(req.params.email)
        const result = await touristSpotCollection.find({email:req.params.email}).toArray();
        res.send(result)
    })

    app.get('/spotDetails/:id',async(req,res)=>{
        console.log(req.params.id)
        const result = await touristSpotCollection.findOne({_id: new ObjectId(req.params.id)})
        res.send(result)
    })
    app.put('/updatePost/:id',async(req,res)=>{
        console.log(req.params.id)
        const query ={_id:new ObjectId(req.params.id)}
        const data= {
            $set:{
                photoUrl:req.body.photoUrl ,
                countryName:req.body.countryName,
                location:req.body.location ,
                discription:req.body.discription,
                seassonality:req.body.seassonality,
                avarageCost:req.body.avarageCost,
                travelTime:req.body.travelTime,
                totalVisitorPerYear:req.body.totalVisitorPerYear

            }
        }
        const result = await touristSpotCollection.updateOne(query,data)
        console.log(result);
        res.send(result)
    })
    app.delete('/delete/:id',async(req,res)=>{
        const result = await touristSpotCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        })
        console.log(result)
        res.send(result)
    })

    // app.get('/updatePosts/:id',async(req,res)=>{
    //     console.log(req.params.id)
    //     const result = await touristSpotCollection.findOne({_id: new ObjectId(req.params.id)})
    //     res.send(result)
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('asian tour and travel server is running')
})

app.listen(port,()=>{
    console.log(`asia tour and  server is running:${port}`)
})