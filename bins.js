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
require("./bin");
const Bin = mongoose.model("Bin");

//connect
const url = "mongodb://127.0.0.1:27017/garbage_collection";
mongoose.connect(url, { useNewUrlParser: true }, () => {
    console.log("Database is connected");
});


app.get('/', async (req, res) => {
    try {
        const bins = await Bin.find();
        res.json(bins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


app.post('/bin', (req, res) => {
    console.log(req.body);
    var newBin = {
        name: req.body.name,
        location: req.body.location,
        height: req.body.height,
        volume: req.body.volume,
        lat: req.body.lat,
        lng: req.body.lng
    }

    // Create a new bin with attribute given above
    var bin = new Bin(newBin);
    bin.save().then(() => {
        console.log("New Bin Created...!");
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })

    res.send("This is our main endpoint for post/create")
})

async function getBin(req, res, next) {
    let bin;
    try {
        bin = await Bin.findById(req.params.id);
        if (bin == null) {
            return res.status(404).json({ message: 'Cannot find bin' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.bin = bin;
    next();
}

//api to get a single bin
app.get('/:id', getBin, (req, res) => {
    res.json(res.bin);
})

//api to delete a bin
app.delete('/:id', getBin, async (req, res) => {
    try {
        await res.bin.remove();
        res.json({ message: 'Deleted bin' })
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