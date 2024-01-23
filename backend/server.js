const express = require("express");
const bodyParser = require("body-parser");
const photoRoutes = require("./routes/photoRoutes");
const authRoutes = require("./routes/authRoutes");
// const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("db connected");
// });

const PORT = process.env.NEXT_PUBLIC_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
