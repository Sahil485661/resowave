const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config();
const { ImageKit, toFile } = require("@imagekit/nodejs");

let clientInstance = null;
function getClient() {
    if (!clientInstance) {
        clientInstance = new ImageKit({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
            timeout: 30000,
            maxRetries: 0,
        });
    }
    return clientInstance;
}

async function uploadFile(fileBuffer, fileName) {
    try {
        const client = getClient();
        const file = await toFile(fileBuffer, fileName);
        const result = await client.files.upload({
            file,
            fileName: `${Date.now()}-${fileName}`,
            folder: "spotify_music",
        });
        return result;
    } catch (error) {
        console.error("ImageKit upload error:", error.message);
        throw error;
    }
}

async function deleteFile(fileId) {
    if (!fileId) return null;
    try {
        const client = getClient();
        return await client.files.delete(fileId);
    } catch (error) {
        console.warn("ImageKit delete error:", error.message);
        return null;
    }
}

// Support both `const uploadFile = require(...)` and `const { uploadFile, deleteFile } = require(...)`
uploadFile.uploadFile = uploadFile;
uploadFile.deleteFile = deleteFile;
uploadFile.getClient = getClient;

module.exports = uploadFile;