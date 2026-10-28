const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRouter = require("./routes/auth.routes")
const musicRouter = require("./routes/music.routes")

const app = express()

// Trust Render's reverse proxy for secure HTTPS cookies
app.set("trust proxy", 1)

// Dynamic CORS configuration supporting Vercel deployments and local development
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
]

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .forEach((url) => {
      if (url && !allowedOrigins.includes(url)) {
        allowedOrigins.push(url)
      }
    })
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    // Automatically allow any Vercel production or preview deployment
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true)
    callback(new Error(`CORS origin not allowed: ${origin}`))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

// Health check routes for Render zero-downtime monitoring
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({ status: "ok", service: "resowave-api", timestamp: new Date().toISOString() })
})

app.use("/api/auth", authRouter)
app.use("/api/music", musicRouter)

module.exports = app