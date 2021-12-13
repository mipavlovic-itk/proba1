const express = require("express");
require("./src/db/mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/users");
const Task = require("./src/models/tasks");
const useRouterUsers = require("./src/routers/users");
const useRouterTasks = require("./src/routers/tasks");

const app = express();
const port = process.env.PORT;

const multer = require("multer");
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(dec|docx)$/)) {
      return cb(new Error("Please upload Word document"));
    }
    cb(undefined, true);

    // cb(new Error('File must be PDF'))
    // cb(undefined, true)
    // cb(undefined, false)
  },
});

const errorMiddleware = function (req, res, next) {
  throw new Error("From middleware");
};
app.post(
  "/upload",
  upload.single("upload"),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);

app.use(express.json());
app.use(useRouterUsers);
app.use(useRouterTasks);

app.listen(port, () => {
  console.log("Server is up on port ", port);
});
