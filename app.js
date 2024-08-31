const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const indexRouter = require("./routes/index");

const app = express();
dotenv.config();

// const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGODB_URL;

mongoose
  .connect(MONGOURL)
  .then(() => console.log("몽구스 연결 성공"))
  .catch((err) => console.log("몽구스 연결 실패", err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

app.use("/", indexRouter);
// app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));

module.exports = app; // Vercel에서 올바르게 서버를 인식하도록 app을 export합니다.
