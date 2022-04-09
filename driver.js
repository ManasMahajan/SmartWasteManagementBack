const mongoose = require("mongoose");

mongoose.model("Driver", {
    //name, salary, emailId, Mobno

    name: {
        type: String,
        require: true
    },

    salary: {
        type: Number,
        require: true
    },

    emailId: {
        type: String,
        require: true
    },

    mobNo: {
        type: Number,
        require: true
    }
});