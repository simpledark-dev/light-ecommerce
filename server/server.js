const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./dbConfig");

app.use(express.json());
app.use(cors());

dbConnect();

const publicRoutes = require("./routes/publicRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const imageUploadRoutes = require("./routes/imageUploadRoutes.js");

app.use("/", publicRoutes);
app.use("/", adminRoutes);
app.use("/", authRoutes);
app.use("/", imageUploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
