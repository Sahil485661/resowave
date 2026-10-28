const jwt = require("jsonwebtoken");

function extractToken(req) {
    if (req.cookies?.token) return req.cookies.token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }
    return null;
}

async function authArtist(req, res, next) {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing or expired" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "Forbidden: You do not have artist permission" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Token expired or invalid" });
    }
}

async function authUser(req, res, next) {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Token expired or invalid" });
    }
}

module.exports = { authArtist, authUser };