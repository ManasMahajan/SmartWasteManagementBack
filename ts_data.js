const { ObjectId } = require("bson");
const mongoose = require("mongoose");

mongoose.model("ts_data", {


    binId: {
        type: ObjectId,
        require: true
    },
    binName: {
        type: String,
        require: true
    },
    timeStamp: {
        type: Number,
        require: true
    },
    fillLevel: {
        type: Number,
        require: true
    }
});