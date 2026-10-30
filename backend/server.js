const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

let conn = null;
async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (!conn) conn = mongoose.connect(process.env.MONGO_URI);
  await conn;
}

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (e) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (req, res) => res.send("E-Commerce API is running"));

app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/products", require("./routes/productroutes"));
app.use("/api/orders", require("./routes/orderroutes"));
app.use("/api/stats", require("./routes/statsroutes"));

if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => console.log("Server on port " + PORT));
    })
    .catch((e) => console.log("DB error:", e.message));
}

