//Load express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require('cors')

app.use(cors());

app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// Load mongoose
const mongoose = require("mongoose");

//import bin model
require("./depot");
const Bin = mongoose.model("Depot");

//connect
const url = "mongodb://127.0.0.1:27017/garbage_collection";
mongoose.connect(url, { useNewUrlParser: true }, () => {
    console.log("Database is connected");
});


app.get('/', async (req, res) => {
    try {
        const depots = await Depot.find();
        res.json(depots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

app.post('/depot', (req, res) => {
    console.log(req.body);
    var newDepot = {
        Name: req.body.Name,
        Latitude: req.body.Latitude,
        Longitude: req.body.Longitude,
    }

    // Create a new bin with attribute given above
    var depot = new Depot(newDepot);
    depot.save().then(() => {
        console.log("New Depot Created...!");
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })

    res.send("This is our main endpoint for post/create")
})

async function getDepot(req, res, next) {
    let depot;
    try {
        depot = await Depot.findById(req.params.id);
        if (depot == null) {
            return res.status(404).json({ message: 'Cannot find depot' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.depot = depot;
    next();
}

//api to get a single depot
app.get('/:id', getDepot, (req, res) => {
    res.json(res.depot);
})

//api to delete a depot
app.delete('/:id', getDepot, async (req, res) => {
    try {
        await res.depot.remove();
        res.json({ message: 'Deleted Depot' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//update one bin
app.post('/update/:id', getBin, async (req, res) => {
    console.log("update request received")
    if (req.body.name != null) {
        res.bin.name = req.body.name
    }
    if (req.body.location != null) {
        res.bin.location = req.body.location
    }
    if (req.body.height != null) {
        res.bin.height = req.body.height
    }
    if (req.body.volume != null) {
        res.bin.volume = req.body.volume
    }
    try {
        const updatedBin = await res.bin.save()
        //res.json(updatedBin)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})



app.listen(4545, () => {
    console.log("Up and running! -- This is our bins service");
})