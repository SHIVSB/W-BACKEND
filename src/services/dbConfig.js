const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("DB connected successfully");
  } catch (error) {
    console.log(`Error ${error}`);
  }
};

module.exports = dbConnect;