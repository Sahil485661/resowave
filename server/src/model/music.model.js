const mongoose = require("mongoose");

const musicSchema = mongoose.Schema({
    musicName: {
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    musicUrl: {
        type: String,
        required: true,
    },
    coverUrl: {
        type: String,
        default: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    },
    fileId: {
        type: String,
    },
    duration: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const musicModel = mongoose.model("music", musicSchema);
module.exports = musicModel;