const request = require("supertest");
const app = require("../app");
const Pin = require("../models/Pin");

describe("Pins API", () => {
  beforeEach(async () => {
    await Pin.deleteMany({});
  });

  describe("POST /", () => {
    test("should create a new pin", async () => {
      const res = await request(app)
        .post("/pins")
        .send({ lat: 1, long: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body.nest).toBe("1boom2");
    });

    test("should return a 500 error if there is a problem saving the pin", async () => {
      const PinMock = jest.spyOn(Pin.prototype, "save").mockImplementationOnce(() => {
        throw new Error("Failed to save pin");
      });

      const res = await request(app)
        .post("/pins")
        .send({ lat: 1, long: 2 });

      expect(PinMock).toHaveBeenCalled();
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("Failed to save pin");
    });
  });

  describe("GET /", () => {
    test("should return an empty array if there are no pins", async () => {
      const res = await request(app).get("/pins");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    test("should return all pins if they exist", async () => {
      await Pin.create({ lat: 1, long: 2 });
      await Pin.create({ lat: 3, long: 4 });

      const res = await request(app).get("/pins");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].lat).toBe(1);
      expect(res.body[0].long).toBe(2);
      expect(res.body[1].lat).toBe(3);
      expect(res.body[1].long).toBe(4);
    });

    test("should return a 500 error if there is a problem fetching the pins", async () => {
      const PinMock = jest.spyOn(Pin, "find").mockImplementationOnce(() => {
        throw new Error("Failed to fetch pins");
      });

      const res = await request(app).get("/pins");

      expect(PinMock).toHaveBeenCalled();
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("Failed to fetch pins");
    });
  });
});
