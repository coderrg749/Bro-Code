const mongoose = require("mongoose");
const dbConnect = () => {
    const MONGO_URL = process.env.MONGO_URL
  try {
    const conn = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Db connection is successfuly at ${MONGO_URL}`)
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

module.exports= dbConnect;