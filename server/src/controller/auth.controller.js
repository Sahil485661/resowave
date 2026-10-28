const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction, // Set to true in prod HTTPS so Vercel can receive cookies from Render
    sameSite: isProduction ? "none" : "lax", // Set to 'none' in prod for cross-site cookie transmission
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

async function registerUser(req, res) {
    try {
        const { email, password, role = "user" } = req.body;
        const name = req.body.name || req.body.userName;
        const userName = req.body.userName || req.body.name || (email ? email.split("@")[0] : "");
        const age = Number(req.body.age) || 18;

        if (!email || !password || !userName) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const normalizedUserName = userName.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        const isUserExist = await userModel.findOne({
            $or: [{ userName: normalizedUserName }, { email: normalizedEmail }]
        });
        if (isUserExist) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            email: normalizedEmail,
            userName: normalizedUserName,
            name: name || normalizedUserName,
            role,
            age,
            password: hash,
        });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, COOKIE_OPTIONS);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: userResponse,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const identifier = req.body.email || req.body.identifier;
        const password = req.body.password;

        if (!identifier || !password) {
            return res.status(400).json({ message: "Please enter your email and password" });
        }

        const identifierLowerCase = identifier.trim().toLowerCase();
        const user = await userModel.findOne({
            $or: [{ userName: identifierLowerCase }, { email: identifierLowerCase }]
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Password or email is incorrect" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, COOKIE_OPTIONS);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: userResponse,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function logoutUser(req, res) {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: "User logged out successfully" });
}

module.exports = { registerUser, loginUser, getMe, logoutUser };