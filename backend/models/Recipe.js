const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    steps: {
      type: [String],
      default: [],
    },

    viewCount: {
      type: Number,
      default: 0
    },

    searchCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
  
);

module.exports = mongoose.model("Recipe", recipeSchema);