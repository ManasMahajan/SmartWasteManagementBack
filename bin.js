const mongoose = require("mongoose");

mongoose.model("Bin", {
    //name, location, height, volume, latitude, longitude

    name: {
        type: String,
        require: true
    },

    location: {
        type: String,
        require: true
    },

    height: {
        type: Number,
        require: true
    },

    volume: {
        type: Number,
        require: true
    },

    lat: {
        type: Number,
        require:true
    },

    lng: {
        type: Number,
        require: true
    }
});