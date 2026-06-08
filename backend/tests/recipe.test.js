const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

let token;
let createdRecipeId;

beforeAll(async () => {
  const loginRes = await request(app)
    .post("/admin/login")
    .send({
      email: "admin@recipehub.com",
      password: "123456",
    });

  token = loginRes.body.token;
});

describe("Recipe API Regression Test", () => {
  test("GET /recipes", async () => {
    const res = await request(app).get("/recipes");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /recipes/:id", async () => {
    const recipes = await request(app).get("/recipes");

    const recipeId = recipes.body[0]._id;

    const res = await request(app).get(`/recipes/${recipeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(recipeId);
  });
});

test("POST /recipes", async () => {
  const res = await request(app)
    .post("/recipes")
    .set("Authorization", `Bearer ${token}`)
    .field("title", "Regression Test Recipe")
    .field("category", "Test")
    .field("time", "10 menit")
    .field("difficulty", "Mudah")
    .field("ingredients", JSON.stringify(["Bahan Test"]))
    .field("steps", JSON.stringify(["Langkah Test"]));

  console.log("POST RESPONSE:", res.body);

  expect(res.statusCode).toBe(201);

  createdRecipeId = res.body._id;
});

test("PUT /recipes/:id", async () => {
  const res = await request(app)
    .put(`/recipes/${createdRecipeId}`)
    .set("Authorization", `Bearer ${token}`)
    .field("title", "Updated Regression Recipe")
    .field("category", "Updated Category")
    .field("time", "15 menit")
    .field("difficulty", "Sedang")
    .field("ingredients", JSON.stringify(["Bahan Update"]))
    .field("steps", JSON.stringify(["Langkah Update"]));

  console.log("PUT RESPONSE:", res.body);

  expect(res.statusCode).toBe(200);
  expect(res.body.title).toBe("Updated Regression Recipe");
});

test("DELETE /recipes/:id", async () => {
  const res = await request(app)
    .delete(`/recipes/${createdRecipeId}`)
    .set("Authorization", `Bearer ${token}`);

  console.log("DELETE RESPONSE:", res.body);

  expect(res.statusCode).toBe(200);
});

afterAll(async () => {
  await mongoose.connection.close();
});