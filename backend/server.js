require("dotenv").config();

// backend server utama RecipeHub
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// security packages
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

// models
const Recipe = require("./models/Recipe");
const Admin = require("./models/Admin");
const User = require("./models/User");
const Favorite = require("./models/Favorite");

// auth packages
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("./config/cloudinary");
const path = require("path");

const app = express();

const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recipehub",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],
  },
});

const upload = multer({
  storage,
});

// secret token
require("dotenv").config();

const JWT_SECRET =
  process.env.JWT_SECRET;

// MIDDLEWARE
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

// VALIDATION HELPERS
// helper validasi input
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  next();
};

// validasi resep
const recipeValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Judul resep wajib diisi"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Kategori wajib diisi"),

  body("time")
    .trim()
    .notEmpty()
    .withMessage("Waktu memasak wajib diisi"),

  body("difficulty")
    .trim()
    .notEmpty()
    .withMessage("Tingkat kesulitan wajib diisi"),

  body("image")
    .trim()
    .notEmpty()
    .withMessage("Gambar resep wajib diisi"),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Bahan-bahan wajib diisi"),

  body("steps")
    .isArray({ min: 1 })
    .withMessage("Langkah memasak wajib diisi"),
];

// validasi favorite
const favoriteValidator = [
  body("recipeId")
    .notEmpty()
    .withMessage("recipeId wajib diisi"),

  body("recipeData")
    .notEmpty()
    .withMessage("Data resep wajib disertakan"),
];


// JWT MIDDLEWARE

// verify token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token tidak ditemukan",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token tidak valid",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token expired / tidak valid",
    });
  }
};

// cek role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Akses ditolak",
      });
    }

    next();
  };
};

// RATE LIMIT

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Terlalu banyak percobaan login. Coba lagi nanti.",
  },
});

// DATABASE
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected");
    console.log(
      "DB NAME:",
      mongoose.connection.name
    );
  })
  .catch((err) => console.log(err));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API RecipeHub TEST 2026");
});

// AUTH ADMIN
// register admin
app.post(
  "/admin/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Nama admin wajib diisi"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Email admin tidak valid"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password admin minimal 6 karakter"),
  ],

  handleValidationErrors,

  async (req, res) => {
    try {
      const {
              name,
              email,
              password,
              age,
              foodPreference
            } = req.body;

      const existingAdmin = await Admin.findOne({ email });

      if (existingAdmin) {
        return res.status(409).json({
          message: "Email admin sudah terdaftar",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
      });

      const savedAdmin = await newAdmin.save();

      res.status(201).json({
        message: "Admin berhasil dibuat",

        admin: {
          id: savedAdmin._id,
          name: savedAdmin.name,
          email: savedAdmin.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// login admin
app.post(
  "/admin/login",

  authLimiter,

  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email admin tidak valid"),

    body("password")
      .notEmpty()
      .withMessage("Password admin wajib diisi"),
  ],

  handleValidationErrors,

  async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email });

      if (!admin) {
        return res.status(401).json({
          message: "Email admin tidak ditemukan",
        });
      }

      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Password admin salah",
        });
      }

      const token = jwt.sign(
        {
          id: admin._id,
          email: admin.email,
          role: "admin",
        },

        JWT_SECRET,

        {
          expiresIn: "1d",
        }
      );

      res.json({
        message: "Login admin berhasil",

        token,

        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// AUTH USER

// PROFILE USER

app.get(
  "/profile",
  verifyToken,

  async (req, res) => {
    try {

      const user = await User.findById(
        req.user.id
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User tidak ditemukan",
        });
      }

      res.json(user);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

app.put(
  "/profile",
  verifyToken,

  async (req, res) => {
    try {

      const updatedUser =
        await User.findByIdAndUpdate(
          req.user.id,
          {
            name: req.body.name,
            age: req.body.age,
            foodPreference:
              req.body.foodPreference,
          },
          {
            new: true,
          }
        );

      res.json(updatedUser);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// register user
app.post(
  "/auth/register",

  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Nama wajib diisi"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Email tidak valid"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
  ],

  handleValidationErrors,

  async (req, res) => {
    try {
      const {
              name,
              email,
              password,
              age,
              foodPreference
            } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          message: "Email sudah terdaftar",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
          name,
          email,
          password: hashedPassword,
          age,
          foodPreference,
      });

      const savedUser = await newUser.save();

      console.log("USER TERSIMPAN:");
      console.log(savedUser);

      res.status(201).json({
        message: "Register berhasil",

        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// login user
app.post(
  "/auth/login",

  authLimiter,

  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email tidak valid"),

    body("password")
      .notEmpty()
      .withMessage("Password wajib diisi"),
  ],

  handleValidationErrors,

  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: "Email tidak ditemukan",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Password salah",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: "user",
        },

        JWT_SECRET,

        {
          expiresIn: "1d",
        }
      );

      res.json({
        message: "Login berhasil",

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          foodPreference: user.foodPreference,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// USERS
// ambil semua user
app.get(
  "/users",
  verifyToken,
  requireRole("admin"),

  async (req, res) => {
    try {
      const users = await User.find().select("-password");

      res.json(users);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// hapus user
app.delete(
  "/users/:id",
  verifyToken,
  requireRole("admin"),

  async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(
        req.params.id
      );

      if (!deletedUser) {
        return res.status(404).json({
          message: "User tidak ditemukan",
        });
      }

      res.json({
        message: "User berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// RECIPES
// ambil semua resep
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();

    res.json(recipes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// detail resep
app.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: "Resep tidak ditemukan",
      });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// tambah resep
app.post(
  "/recipes",

  verifyToken,
  requireRole("admin"),

  upload.single("image"),

  async (req, res) => {
    try {

      const newRecipe = new Recipe({
        title: req.body.title,
        category: req.body.category,
        time: req.body.time,
        difficulty: req.body.difficulty,
        recommendationType: req.body.recommendationType,

        image: req.file
          ? req.file.path
          : "",

        ingredients: JSON.parse(
          req.body.ingredients
        ),

        steps: JSON.parse(
          req.body.steps
        ),
      });

      const savedRecipe =
        await newRecipe.save();

      res.status(201).json(savedRecipe);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// update resep
app.put(
  "/recipes/:id",

  verifyToken,
  requireRole("admin"),
  upload.single("image"),

async (req, res) => {
  try {

    const updateData = {
      title: req.body.title,
      category: req.body.category,
      time: req.body.time,
      difficulty: req.body.difficulty,
      recommendationType: req.body.recommendationType,
      ingredients: JSON.parse(
        req.body.ingredients
      ),
      steps: JSON.parse(
        req.body.steps
      ),
    };

    if (req.file) {
      updateData.image =
        req.file.path;
    }

    const updatedRecipe =
      await Recipe.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          returnDocument: "after"
        }
      );

    res.json(updatedRecipe);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
);

// hapus resep
app.delete(
  "/recipes/:id",

  verifyToken,
  requireRole("admin"),

  async (req, res) => {
    try {
      const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

      if (!deletedRecipe) {
        return res.status(404).json({
          message: "Resep tidak ditemukan",
        });
      }

      res.json({
        message: "Resep berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// tambah view
app.patch("/recipes/:id/view", async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          viewCount: 1,
        },
      },

      {
        returnDocument: "after"
      }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// tambah search
app.patch("/recipes/:id/search", async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          searchCount: 1,
        },
      },

      {
        returnDocument: "after"
      }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// FAVORITES
// tambah favorite
app.post(
  "/favorites",

  verifyToken,
  requireRole("user"),

  favoriteValidator,
  handleValidationErrors,

  async (req, res) => {
    try {
      const { recipeId, recipeData } = req.body;

      const userId = req.user.id;

      const existingFavorite = await Favorite.findOne({
        userId,
        recipeId,
      });

      if (existingFavorite) {
        return res.status(409).json({
          message: "Resep sudah disimpan",
        });
      }

      const newFavorite = new Favorite({
        userId,
        recipeId,
        recipeData,
      });

      const savedFavorite = await newFavorite.save();

      res.status(201).json(savedFavorite);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// ambil favorite user
app.get(
  "/favorites/:userId",

  verifyToken,

  async (req, res) => {
    try {
      if (
        req.user.role === "user" &&
        req.user.id !== req.params.userId
      ) {
        return res.status(403).json({
          message: "Akses ditolak",
        });
      }

      const favorites = await Favorite.find({
        userId: req.params.userId,
      }).sort({
        createdAt: -1,
      });

      res.json(favorites);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// hapus favorite
app.delete(
  "/favorites/:id",

  verifyToken,

  async (req, res) => {
    try {
      const deleted = await Favorite.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          message: "Favorite tidak ditemukan",
        });
      }

      res.json({
        message: "Favorite berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

app.get("/dbtest", async (req, res) => {
  const recipes = await Recipe.find();

  res.json({
    total: recipes.length,
    titles: recipes.map((r) => r.title),
  });
});

// RUN SERVER
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;