//Name, Latitude, Longitude

const mongoose = require("mongoose")

mongoose.model("Depot", {
    Name: {
        type: String,
        require: true
    },

    Latitude: {
        type: Number,
        require: true
    },

    Longitude: {
        type: Number,
        require: true
    }
})