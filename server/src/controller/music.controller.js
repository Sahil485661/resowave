const musicModel = require("../model/music.model")
const jwt = require("jsonwebtoken")
const uploadFile = require("../service/storage.service");
const albumModel = require("../model/album.model");


async function createMusic(req, res) {
    try {
        const title = (req.body.title || req.body.musicName || "").trim();
        const file = req.file ||
            (req.files?.file && req.files.file[0]) ||
            (req.files?.music && req.files.music[0]) ||
            (Array.isArray(req.files) && req.files[0]) ||
            null;

        if (!title || !file) {
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log("Uploading music to cloud:", title, file.originalname);
        const uploadedMusic = await uploadFile(file.buffer, file.originalname);
        console.log("Music uploaded successfully:", uploadedMusic.url);

        const music = await musicModel.create({
            musicName: title,
            artist: req.user.id,
            musicUrl: uploadedMusic.url,
            fileId: uploadedMusic.fileId,
        });

        const populated = await music.populate("artist", "userName email name");

        return res.status(201).json({
            message: "Music created successfully",
            music: {
                _id: music._id,
                id: music._id,
                musicName: music.musicName,
                title: music.musicName,
                artist: populated.artist,
                musicUrl: music.musicUrl,
                coverUrl: music.coverUrl,
                fileId: music.fileId,
            }
        });
    }
    catch (error) {
        console.error("Create music error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function createAlbum(req, res) {
    const { title, musicId } = req.body;
    if (!title || !musicId) {
        return res.status(400).json({ message: "All fields are required" })
    }
    const album = await albumModel.create({
        title: title,
        music: musicId,
        artist: req.user.id
    })
    res.status(201).json({
        message: "Album cr6eated successfully", album: {
            title: album.title,
            music: album.music,
            id: album._id,
            artist: album.artist
        }
    })
}

async function getAllMusics(req, res) {
    const musics = await musicModel.find().populate("artist", "userName email")
    res.status(200).json({ message: "All musics fetched successfully", musics: musics })
}
async function getAlbums(req, res) {
    const albums = await albumModel.find().select("title artist").populate("artist", "userName email")
    res.status(200).json({ message: "All albums fetched successfully", albums: albums })
}
async function getAlbumsById(req, res) {
    const id = req.params.id;
    const album = await albumModel.findById(id).populate("artist", "userName email").populate("music")
}
async function deleteMusic(req, res) {
    try {
        const { id } = req.params;
        const music = await musicModel.findById(id);
        if (!music) {
            return res.status(404).json({ message: "Music track not found" });
        }
        if (music.artist.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "You do not have permission to delete this track" });
        }
        await musicModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Music track deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAlbums, getAlbumsById, deleteMusic }
