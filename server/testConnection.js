const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://mugdha1555_db_user:mongo2028@cluster0.yd3msed.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("✅ Connected Successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection Failed");
    console.error(err);
    process.exit(1);
  });