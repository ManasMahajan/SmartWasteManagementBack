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
require("./driver");
const Driver = mongoose.model("Driver");

//connect
const url = "mongodb://127.0.0.1:27017/garbage_collection";
mongoose.connect(url, { useNewUrlParser: true }, () => {
    console.log("Database is connected");
});


app.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

app.post('/driver', (req, res) => {
    console.log(req.body);
    var newDriver = {
        name: req.body.name,
        salary: req.body.salary,
        mobNo: req.body.mobNo,
        emailId: req.body.emailId
    }

    // Create a new driver with attribute given above
    var driver = new Driver(newDriver);
    driver.save().then(() => {
        console.log("New Driver Created...!");
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })

    res.send("This is our main endpoint for post/create")
})

async function getDriver(req, res, next) {
    let driver;
    try {
        driver = await Driver.findById(req.params.id);
        if (driver == null) {
            return res.status(404).json({ message: 'Cannot find driver' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.driver = driver;
    next();
}

//api to get a single driver
app.get('/:id', getDriver, (req, res) => {
    res.json(res.driver);
})

//api to delete a driver
app.delete('/:id', getDriver, async (req, res) => {
    try {
        await res.driver.remove();
        res.json({ message: 'Deleted driver' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//update one driver
app.post('/update/:id', getDriver, async (req, res) => {
    console.log("update request received")
    if (req.body.name != null) {
        res.driver.name = req.body.name
    }
    if (req.body.salary != null) {
        res.driver.salary = req.body.salary
    }
    if (req.body.mobNo != null) {
        res.driver.mobNo = req.body.mobNo
    }
    if (req.body.emailId != null) {
        res.driver.emailId = req.body.emailId
    }
    try {
        const updatedDriver = await res.driver.save()
        //res.json(updatedDriver)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})



app.listen(4549, () => {
    console.log("Up and running! -- This is our drivers service");
})