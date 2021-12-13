const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("../models/tasks");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be positive number");
        }
      },
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      requiered: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid email");
      },
    },
    password: {
      type: String,
      //required: true,
      minlength: 6,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("Sifra ne moze biti password");
      },
      trim: true,
    },
    tokens: [{ token: { type: String, required: true } }],
    avatar: { type: Buffer },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  console.log(user);
  if (!user) throw new Error("No user");
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(password, user.password, isMatch, await bcrypt.hash(password, 8));
  if (!isMatch) throw new Error("Bad pass");
  return user;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);
// const me = new User({
//   name: "Mi   lan",
//   age: 1,
//   email: "   peSDra@SDS.SD",
// });

// me.save()
//   .then(() => console.log(me))
//   .catch((error) => console.log("Dosla greska:", error));

module.exports = User;
