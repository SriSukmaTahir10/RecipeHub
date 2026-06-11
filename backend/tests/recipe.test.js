const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

let userToken;
let userId;
let token;
let createdRecipeId;
let favoriteId;

beforeAll(async () => {
  const loginRes = await request(app)
    .post("/admin/login")
    .send({
      email: "admin@recipehub.com",
      password: "123456",
    });

  token = loginRes.body.token;
});

test("POST /admin/login berhasil", async () => {
  const res = await request(app)
    .post("/admin/login")
    .send({
      email: "admin@recipehub.com",
      password: "123456",
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.token).toBeDefined();
});

test("POST /admin/login gagal", async () => {
  const res = await request(app)
    .post("/admin/login")
    .send({
      email: "admin@recipehub.com",
      password: "salahpassword",
    });

  expect(res.statusCode).toBe(401);
});

test("POST /admin/login password salah", async () => {

  const res = await request(app)
    .post("/admin/login")
    .send({
      email: "admin@recipehub.com",
      password: "salah"
    });

  expect(res.statusCode).toBe(401);

});

test("POST /admin/register email duplikat", async () => {

  const res = await request(app)
    .post("/admin/register")
    .send({
      name: "Admin",
      email: "admin@recipehub.com",
      password: "123456"
    });

  expect(res.statusCode).toBe(409);

});

describe("Recipe API Regression Test", () => {
  test("GET /recipes", async () => {
    const res = await request(app).get("/recipes");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

test("POST /auth/register", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({
      name: "Regression User",
      email: `user${Date.now()}@gmail.com`,
      password: "123456",
    });

  expect(res.statusCode).toBe(201);
});

test("POST /auth/register email kosong", async () => {

  const res = await request(app)
    .post("/auth/register")
    .send({
      name: "Test",
      email: "",
      password: "123456"
    });

  expect(res.statusCode).toBeGreaterThanOrEqual(400);

});

test("POST /auth/register email duplikat", async () => {

  const email = `dup${Date.now()}@gmail.com`;

  await request(app)
    .post("/auth/register")
    .send({
      name: "Test",
      email,
      password: "123456"
    });

  const res = await request(app)
    .post("/auth/register")
    .send({
      name: "Test",
      email,
      password: "123456"
    });

  expect(res.statusCode).toBe(409);

});

test("POST /auth/register password kosong", async () => {

  const res = await request(app)
    .post("/auth/register")
    .send({
      name: "Test",
      email: "test@gmail.com",
      password: ""
    });

  expect(res.statusCode).toBeGreaterThanOrEqual(400);

});

test("POST /auth/login", async () => {
  const email = `login${Date.now()}@gmail.com`;

  await request(app)
    .post("/auth/register")
    .send({
      name: "Login User",
      email,
      password: "123456",
    });

  const res = await request(app)
    .post("/auth/login")
    .send({
      email,
      password: "123456",
    });

  userToken = res.body.token;
  userId = res.body.user.id;

  expect(res.statusCode).toBe(200);
});

test("POST /auth/login - password salah", async () => {

  const res = await request(app)
    .post("/auth/login")
    .send({
      email: "admin@recipehub.com",
      password: "salah123"
    });

  expect([401,429]).toContain(res.statusCode);

});

test("POST /auth/login - user tidak ditemukan", async () => {

  const res = await request(app)
    .post("/auth/login")
    .send({
      email: "tidakada@gmail.com",
      password: "123456"
    });

  expect([401,429]).toContain(res.statusCode);

});

  test("GET /recipes/:id", async () => {
    const recipes = await request(app).get("/recipes");

    const recipeId = recipes.body[0]._id;

    const res = await request(app).get(`/recipes/${recipeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(recipeId);
  });
});

test("GET /recipes/:id invalid", async () => {
  const res = await request(app)
    .get("/recipes/123");

  expect(res.statusCode).toBe(500);
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

test("POST /recipes tanpa token", async () => {
  const res = await request(app)
    .post("/recipes")
    .field("title", "Tanpa Token");

  expect(res.statusCode).toBe(401);
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

test("PUT /recipes/:id tanpa token", async () => {

  const recipes = await request(app)
    .get("/recipes");

  const recipeId = recipes.body[0]._id;

  const res = await request(app)
    .put(`/recipes/${recipeId}`)
    .field("title","Test");

  expect(res.statusCode).toBe(401);

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

test("DELETE /recipes/:id tidak ditemukan", async () => {
  const res = await request(app)
    .delete("/recipes/60f000000000000000000000")
    .set("Authorization", `Bearer ${token}`);

  expect(
    [404, 200]
  ).toContain(res.statusCode);
});

test("DELETE /recipes/:id tanpa token", async () => {

  const recipes = await request(app)
    .get("/recipes");

  const recipeId = recipes.body[0]._id;

  const res = await request(app)
    .delete(`/recipes/${recipeId}`);

  expect(res.statusCode).toBe(401);

});

test("PATCH /recipes/:id/view", async () => {

  const recipes = await request(app)
    .get("/recipes");

  const recipeId = recipes.body[0]._id;

  const res = await request(app)
    .patch(`/recipes/${recipeId}/view`);

  expect(res.statusCode).toBe(200);
});

test("PATCH /recipes/:id/search", async () => {

  const recipes = await request(app)
    .get("/recipes");

  const recipeId = recipes.body[0]._id;

  const res = await request(app)
    .patch(`/recipes/${recipeId}/search`);

  expect(res.statusCode).toBe(200);
});

test("POST /favorites", async () => {

  const recipes = await request(app)
    .get("/recipes");

  const recipeId = recipes.body[0]._id;

  const res = await request(app)
    .post("/favorites")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      recipeId,
      recipeData: {
        title: "Test Favorite"
      }
    });

  favoriteId = res.body._id;

  expect(res.statusCode).toBe(201);
});

test("GET /favorites/:userId", async () => {

  const res = await request(app)
    .get(`/favorites/${userId}`)
    .set("Authorization", `Bearer ${userToken}`);

  expect(res.statusCode).toBe(200);
});

test("DELETE /favorites/:id", async () => {

  const res = await request(app)
    .delete(`/favorites/${favoriteId}`)
    .set("Authorization", `Bearer ${userToken}`);

  expect(res.statusCode).toBe(200);
});

test("POST /favorites tanpa token", async () => {

  const res = await request(app)
    .post("/favorites")
    .send({
      recipeId: "123"
    });

  expect(res.statusCode).toBe(401);

});

test("GET /favorites/:userId tidak ditemukan", async () => {

  const res = await request(app)
    .get("/favorites/507f1f77bcf86cd799439011")
    .set(
      "Authorization",
      `Bearer ${userToken}`
    );

  expect([200,404,403]).toContain(
    res.statusCode
  );

});

test("GET /users sebagai admin", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
});

test("GET /users tanpa token", async () => {
  const res = await request(app)
    .get("/users");

  expect(res.statusCode).toBe(401);
});

test("GET /users sebagai user", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${userToken}`);

  expect(res.statusCode).toBe(403);
});

test("POST /favorites duplikat", async () => {

  const recipes = await request(app)
    .get("/recipes");

  const recipeId = recipes.body[0]._id;

  await request(app)
    .post("/favorites")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      recipeId,
      recipeData: {
        title: "Duplicate Test"
      }
    });

  const res = await request(app)
    .post("/favorites")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      recipeId,
      recipeData: {
        title: "Duplicate Test"
      }
    });

  expect(res.statusCode).toBe(409);
});

test("DELETE /favorites/:id tidak ditemukan", async () => {

  const res = await request(app)
    .delete("/favorites/507f1f77bcf86cd799439011")
    .set("Authorization", `Bearer ${userToken}`);

  expect(res.statusCode).toBe(404);

});