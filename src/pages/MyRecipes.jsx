import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    console.log("USER LOGIN:", savedUser);
    console.log("TOKEN:", token);
    
    if (!savedUser || !token) return;

    axios
      .get(`http://localhost:5000/favorites/${savedUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setSavedRecipes(response.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <Navbar />

      <div className="recipes-header">
        <h2>Resep Saya</h2>
      </div>

      {savedRecipes.length === 0 ? (
        <p style={{ padding: "20px" }}>Belum ada resep yang disimpan 😢</p>
      ) : (
        <div className="recipes-grid">
          {savedRecipes.map((item) => (
            <div
              className="recipe-card"
              key={item._id}
              onClick={() => navigate(`/recipes/${item.recipeId}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`http://localhost:5000/uploads/${item.recipeData.image}`}
                alt={item.recipeData.title}
              />

              <div className="recipe-info">
                <h4>{item.recipeData.title}</h4>
                <div className="recipe-meta">
                  <span>{item.recipeData.time}</span>
                  <span>⭐ {item.recipeData.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRecipes;