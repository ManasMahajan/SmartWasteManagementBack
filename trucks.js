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


const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/garbage_collection";
mongoose.connect(url, { useNewUrlParser: true }, () => {
    console.log("Database is connected");
});

require("./truck");
const Truck = mongoose.model("Truck");



app.get('/', async (req, res) => {
    try {
        const trucks = await Truck.find();
        res.json(trucks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

app.post('/truck', (req, res) => {
    console.log(req.body);
    var newTruck = {
        //RegistrationNumber, Model, Name, Capacity, CostPerUnitTime, CostPerUnitDistance
        RegistrationNumber: req.body.RegistrationNumber,
        Model: req.body.Model,
        Name: req.body.Name,
        Capacity: req.body.Capacity,
        ParkingLatitude: req.body.ParkingLatitude,
        ParkingLongitude: req.body.ParkingLongitude,
        ParkingName: req.body.ParkingName,
        CostPerUnitDistance: req.body.CostPerUnitDistance
    }

    var truck = new Truck(newTruck);
    truck.save().then(() => {
        console.log("New Truck Created..!!");
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })

    res.send("New Truck Created!!!")
})

async function getTruck(req, res, next) {
    let truck;
    try {
        truck = await Truck.findById(req.params.id);
        if (truck == null) {
            return res.status(404).json({ message: 'Cannot find truck' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.truck = truck
    next()
}

//api to get a single truck
app.get('/:id', getTruck, (req, res) => {
    res.json(res.truck)
})

//api to delete a truck
app.delete('/:id', getTruck, async (req, res) => {
    try {
        await res.truck.remove()
        res.json({ message: 'Deleted Truck' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//update one truck
app.post('/update/:id', getTruck, async (req, res) => {
    if (req.body.RegistrationNumber != null) {
        res.truck.RegistrationNumber = req.body.RegistrationNumber
    }
    if (req.body.Name != null) {
        res.truck.Name = req.body.Name
    }
    if (req.body.Model != null) {
        res.truck.Model = req.body.Model
    }
    if (req.body.Capacity != null) {
        res.truck.Capacity = req.body.Capacity
    }
    if (req.body.CostPerUnitDistance != null) {
        res.truck.CostPerUnitDistance = req.body.CostPerUnitDistance
    }
    if (req.body.ParkingLatitude != null) {
        res.truck.ParkingLatitude = req.body.ParkingLatitude
    }
    if (req.body.ParkingLongitude != null) {
        res.truck.ParkingLongitude = req.body.ParkingLongitude
    }
    if (req.body.ParkingName != null) {
        res.truck.ParkingName = req.body.ParkingName
    }
    try {
        const updatedTruck = await res.truck.save()
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

app.listen(4548, () => {
    console.log("Truck service is online!")
})