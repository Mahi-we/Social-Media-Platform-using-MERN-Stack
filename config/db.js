const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Full MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
