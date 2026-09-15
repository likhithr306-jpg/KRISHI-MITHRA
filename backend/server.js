const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const featureRoutes = require("./routes/featureRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=========================================`);
  console.log(`✅ SERVER IS LIVE: http://localhost:${PORT}`);
  console.log(`🚀 API BASE: http://localhost:${PORT}/api`);
  console.log(`=========================================\n`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ ERROR: Port ${PORT} is already in use!`);
    console.error(`👉 Solution: Close other terminal windows or change PORT in .env`);
  } else {
    console.error("❌ Server Error:", err.message);
  }
});