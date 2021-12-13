const express = require("express");
const multer = require("multer");
const router = new express.Router();
const User = require("../models/users");
const auth = require("../middleware/auth");
const sharp = require("sharp");
const { sendWelcomeEmail, sendGoodbyeEmail } = require("../emails/account");

router.post("/user", async (req, res) => {
  const user = new User(req.body);
  console.log(user);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/user", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/user/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/user/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) return res.status(404).send({ e: "Not found" });
    sendGoodbyeEmail(req.user.email, req.user.name);
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});
const storage = multer.memoryStorage();

const upload = multer({
  dest: "avatars",
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|pmg)$/))
      return cb(new Error("Please upload an image"));
    cb(undefined, true);
  },
  storage,
});

router.post(
  "/user/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);

router.delete(
  "user/me/avatar",
  auth,
  upload.single(
    "avatar",
    async (req, res) => {
      req.user.avatar = undefined;
      await req.user.save();
      res.send();
    },
    (error, req, res, next) => res.status(400).send(error.message)
  )
);

router.get("/user/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar)
      throw new Error("Nema korisnika ili korisnik nema avatar");
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});
module.exports = router;
