require("dotenv").config();
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI not set");
  }

  try {
    // Ensure we connect to the horeca1 database
    let connectionString = mongoUri;
    // If the URI doesn't end with a database name, add /horeca1
    if (!connectionString.match(/\/[^\/\?]+(\?|$)/)) {
      connectionString = connectionString.replace(/\/(\?|$)/, '/horeca1$1');
    } else {
      // Replace any existing database name with horeca1
      connectionString = connectionString.replace(/\/[^\/\?]+(\?|$)/, '/horeca1$1');
    }
    
    await mongoose.connect(connectionString);
    isConnected = true;
    console.log("MongoDB connected to database:", mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("MongoDB failed:", err.message);
    isConnected = false;
    throw err;
  }
};

const ensureConnection = async () => {
  if (mongoose.connection.readyState === 1) return true;
  try {
    await connectDB();
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
};

module.exports = { connectDB, ensureConnection };
