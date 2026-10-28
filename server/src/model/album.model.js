const mongoose = require("mongoose")

const albumSchema = mongoose.Schema({
    title:{
        type: String, required: true
    },
    music:[{
        type: mongoose.Schema.Types.ObjectId, ref: "music", required: true
    }],
    artist:{
        type: mongoose.Schema.ObjectId, ref: "user", required: true
    }

})
const albumModel = mongoose.model("album",albumSchema);
module.exports = albumModel