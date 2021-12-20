const request = require("supertest");
const app = require("../app");
const User = require("../src/models/users");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mike@gmail.com",
  password: "sadasdasdasdas",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("should signup a new user", async () => {
  await request(app)
    .post("/user")
    .send({
      name: "Andrew",
      email: "milsdan.pavlovic1998@gmail.com",
      password: "plediko",
    })
    .expect(201);
});

test("should login a new user", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("should not login a new user", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: "not good pass",
    })
    .expect(400);
});

test("should get profile for user", async () => {
  await request(app)
    .get("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for user", async () => {
  await request(app).get("user/me").send().expect(401);
});

test("should delete profile for user", async () => {
  await request(app)
    .delete("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not delete profile for user", async () => {
  await request(app).delete("user/me").send().expect(500);
});
