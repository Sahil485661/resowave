const express = require("express");
const router = express.Router();
const musicController = require("../controller/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const isAudioMime = file.mimetype && file.mimetype.startsWith("audio/");
        const isAudioExt = /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.originalname);
        if (isAudioMime || isAudioExt) {
            cb(null, true);
        } else {
            cb(new Error("Only audio files (MP3, WAV, AAC, FLAC, OGG) are allowed"));
        }
    },
});

function handleUploadMiddleware(req, res, next) {
    upload.any()(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || "File upload failed" });
        }
        next();
    });
}

router.post("/upload", authMiddleware.authArtist, handleUploadMiddleware, musicController.createMusic);
router.post("/create_music", authMiddleware.authArtist, handleUploadMiddleware, musicController.createMusic);
router.post("/create_album", authMiddleware.authArtist, musicController.createAlbum);
router.get("/", musicController.getAllMusics);
router.get("/album", musicController.getAlbums);
router.get("/album/:id", musicController.getAlbumsById);
router.delete("/:id", authMiddleware.authArtist, musicController.deleteMusic);

module.exports = router;