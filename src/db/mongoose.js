const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  //useCreateIndex: true,
});

// const task = new Tasks({ description: "uci note", completed: true });

// task.save();
