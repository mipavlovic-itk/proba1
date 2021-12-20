const express = require("express");
require("./src/db/mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/users");
const Task = require("./src/models/tasks");
const useRouterUsers = require("./src/routers/users");
const useRouterTasks = require("./src/routers/tasks");
const app = require("../task-manager/app");

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server is up on port ", port);
});
//
//mongodb://127.0.0.1:27017/task-manager-apis
