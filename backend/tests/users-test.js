const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

describe("User API", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /register", () => {
    test("should register a new user", async () => {
      const res = await request(app)
        .post("/users/register")
        .send({
          username: "johndoe",
          email: "johndoe@example.com",
          password: "password",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toBeDefined();

      const user = await User.findOne({ username: "johndoe" });
      expect(user).toBeDefined();
      expect(user.email).toBe("johndoe@example.com");
    });

    test("should return a 500 error if there is a problem saving the user", async () => {
      const UserMock = jest
        .spyOn(User.prototype, "save")
        .mockImplementationOnce(() => {
          throw new Error("Failed to save user");
        });

      const res = await request(app)
        .post("/users/register")
        .send({
          username: "johndoe",
          email: "johndoe@example.com",
          password: "password",
        });

      expect(UserMock).toHaveBeenCalled();
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("Failed to save user");
    });
  });

  describe("POST /login", () => {
    test("should login a user", async () => {
      await User.create({
        username: "johndoe",
        email: "johndoe@example.com",
        password: await bcrypt.hash("password", 10),
      });

      const res = await request(app)
        .post("/users/login")
        .send({
          username: "johndoe",
          password: "password",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBeDefined();
      expect(res.body.username).toBe("johndoe");
    });

    test("should return a 400 error if the username is not registered", async () => {
      const res = await request(app)
        .post("/users/login")
        .send({
          username: "johndoe",
          password: "password",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toBe("Username not registered!");
    });

    test("should return a 400 error if the password is incorrect", async () => {
      await User.create({
        username: "johndoe",
        email: "johndoe@example.com",
        password: await bcrypt.hash("password", 10),
      });

      const res = await request(app)
        .post("/users/login")
        .send({
        username: "johndoe",
        password: "wrongpassword",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Incorrect credentials, Try Again!");
      });
      
      test("should return a 500 error if there is a problem fetching the user", async () => {
        const UserMock = jest
          .spyOn(User, "findOne")
          .mockImplementationOnce(() => {
            throw new Error("Failed to fetch user");
          });
      
        const res = await request(app)
          .post("/users/login")
          .send({
            username: "johndoe",
            password: "password",
          });
      
        expect(UserMock).toHaveBeenCalled();
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Failed to fetch user");
      });
    });
});      
