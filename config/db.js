const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

// mongodb+srv://scarchive:kBPA828rg6ppypFK@cluster0.ilqvptt.mongodb.net/get_sound?retryWrites=true&w=majority

// mongodb+srv://root:root@cluster0.y6mrt.mongodb.net/get-saound-webtest?retryWrites=true&w=majority