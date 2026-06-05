import { useEffect, useState } from "react";
import NavbarRecipes from "../components/NavbarRecipes";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Recipes() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/recipes")
      .then((response) => setRecipes(response.data))
      .catch((err) => console.log(err));
  }, []);

  // filter resep berdasarkan judul / kategori
  const filteredRecipes = recipes.filter((item) => {
    const title = item.title?.toLowerCase() || "";
    const category = item.category?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return title.includes(search) || category.includes(search);
  });

  return (
    <div className="container">
      <NavbarRecipes searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="recipes-header">
        <h2>Semua Resep</h2>
      </div>

      <div className="recipes-grid">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((item) => (
            <div
              className="recipe-card"
              key={item._id}
              onClick={() => navigate(`/recipes/${item._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.title}
                    />

              <div className="recipe-info">
                <h4>{item.title}</h4>
                <div className="recipe-meta">
                  <span>{item.time}</span>
                  <span>⭐ {item.rating}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ padding: "20px" }}>Resep tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
}

export default Recipes;