//RegistrationNumber, Model, Name, Capacity, CostPerUnitTime, CostPerUnitDistance

const mongoose = require("mongoose");

mongoose.model("Truck", {
    RegistrationNumber: {
        type: String,
        require: true
    },

    Name: {
        type: String,
        require: true
    },

    Model: {
        type: String,
        require: true
    },

    Capacity: {
        type: Number,
        require: true
    },

    ParkingLatitude: {
        type: Number,
        require: true
    },

    ParkingLongitude: {
        type: Number,
        require: true
    },

    ParkingName: {
        type: String,
        require: true
    },

    CostPerUnitDistance: {
        type: Number,
        require: true
    }
});