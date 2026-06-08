# RecipeHub

Website pencarian resep berbasis React.js, Express.js, dan MongoDB.

## Fitur
- Login JWT
- Dashboard Admin
- CRUD Resep
- Upload Gambar
- Search Resep
- Performance Testing (k6)
- Security Testing

## Cara Menjalankan

Frontend:
npm install
npm start

Backend:
cd backend
npm install
node server.js

# RecipeHub - Regression Test Suite

## Deskripsi

RecipeHub adalah aplikasi web berbasis React.js, Express.js, dan MongoDB yang menyediakan fitur manajemen resep makanan. Pada tugas ini dilakukan implementasi Regression Test Suite menggunakan Jest dan Supertest untuk memastikan endpoint REST API tetap berfungsi setelah adanya perubahan kode.

## Teknologi

* React.js
* Express.js
* MongoDB
* JWT Authentication
* Axios
* Jest
* Supertest

## Cara Menjalankan Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

Jalankan server:

```bash
node server.js
```

atau

```bash
npx nodemon server.js
```

## Cara Menjalankan Regression Test

Masuk ke folder backend:

```bash
cd backend
```

Jalankan test:

```bash
npm test
```

## Endpoint yang Diuji

* GET /recipes
* GET /recipes/:id
* POST /recipes
* PUT /recipes/:id
* DELETE /recipes/:id

## Hasil Pengujian

Seluruh endpoint berhasil diuji menggunakan Jest dan Supertest dengan hasil:

* 5 Test Passed
* 1 Test Suite Passed