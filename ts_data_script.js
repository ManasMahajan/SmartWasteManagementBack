// Load express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

// Load mongoose
const mongoose = require("mongoose");

// import book model
require("./ts_data");
const ts_data_model = mongoose.model("ts_data");

// connect
const url = "mongodb://127.0.0.1:27017/garbage_collection";
mongoose.connect(url, () => {
    console.log("Database is connected!");
});

//get all the available timseries data
app.get('/ts_data', async (req, res) => {
    try {
        const data = await ts_data_model.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//get data for dashboard
app.get('/ts_data/dashboard', async (req, res) => {
    try {
        const data = await ts_data_model.aggregate(
            [

                { $sort: { binId: 1, timeStamp: 1, binName: 1 } },
                {
                    $group: {
                        _id: "$binId",
                        name: { $last: "$binName" },
                        lasttime: { $last: "$timeStamp" },
                        lastfill: { $last: "$fillLevel" }
                    }
                }
            ]
        )
        res.json(data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//get the latest fill Level for one bin
app.get('/ts_data/fill_level/:id', async (req, res) => {
    try {
        const data = await ts_data_model.find({ binId: req.params.id }).sort({ timeStamp: -1 }).limit(1)
        res.json(data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.post('/ts_data', (req, res) => {
    console.log(req.body);
    var newts_data = {
        binId: req.body.binId,
        binName: req.body.binName,
        timeStamp: req.body.timeStamp,
        fillLevel: req.body.fillLevel
    }

    // Create a new ts_data entry with attributes given above
    var ts_data = new ts_data_model(newts_data);
    ts_data.save().then(() => {
        console.log("New data inserted...!");
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })

    res.send("This is our main endpoint--- for post/create");

})

app.listen(4546, () => {
    console.log("Up and running! -- This is our  service");
})