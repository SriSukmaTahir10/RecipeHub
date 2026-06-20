import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import foodFloat from "../assets/images/food-float.png";
import search from "../assets/images/search.png";

function Home() {
  const navigate = useNavigate();

  // state data resep dari backend
  const [recipes, setRecipes] = useState([]);

  // state loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user =
JSON.parse(localStorage.getItem("user"));

const recommendedRecipes =
  recipes.filter(
    (recipe) =>
      recipe.recommendationType?.toLowerCase() ===
      user?.foodPreference?.toLowerCase()
  )
  .slice(0, 3);

console.log("USER:");
console.log(user);

console.log("RECIPES:");
console.log(recipes);

console.log("RECOMMENDED:");
console.log(recommendedRecipes);

  // ambil resep dari backend
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);

        const response = await axios.get("http://localhost:5000/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data resep.");
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // resep terbaru dari database
  const latestRecipes = [...recipes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // resep populer dari viewCount + searchCount
  const popularRecipes = [...recipes]
    .sort((a, b) => {
      const scoreA = (a.viewCount || 0) + (a.searchCount || 0);
      const scoreB = (b.viewCount || 0) + (b.searchCount || 0);

      if (scoreB !== scoreA) return scoreB - scoreA;

      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 2);

  return (
    <div className="container">
      <Navbar />

      <div
        className="search-bar"
        onClick={() => navigate("/recipes")}
        style={{ cursor: "pointer" }}
      >
        <img src={search} alt="search" />
        <input placeholder="Cari resep, bahan, atau kategori....." readOnly />
        <img src={search} alt="search" />
      </div>

      {loading && <p style={{ padding: "20px" }}>Memuat resep...</p>}

      {error && <p style={{ padding: "20px", color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="hero">
            <div className="hero-text">
              <h1>
                Temukan Resep
                <br />
                Sesuai Selera Anda
              </h1>
              <p>
                Cari dan dapatkan rekomendasi resep berdasarkan umur serta preferensi makanan Anda.
              </p>

              <button onClick={() => navigate("/recipes")}>Jelajahi Resep</button>
            </div>

            <div className="hero-img">
              <img src={foodFloat} alt="floating food" />
            </div>
          </div>

          <div className="recipes-section">
            <h3>Rekomendasi Untuk Anda ⭐</h3>
          <div className="recipes-grid">
            {recommendedRecipes.map((item) => (
          <div
              key={item._id}
              className="recipe-card"
              onClick={() =>
              navigate(`/recipes/${item._id}`)
          }
          >
        <img
            src={`http://localhost:5000/uploads/${item.image}`}
            alt={item.title}
        />

        <h4>{item.title}</h4>
        <p>{item.time} • ⭐ {item.rating}</p>
      </div>
        ))}
      </div>

      </div>
          
          <div className="recipes-section">
            <h3>Resep Terbaru</h3>

            <div className="recipes-grid">
              {latestRecipes.length > 0 ? (
                latestRecipes.map((item) => (
                  <div
                    key={item._id}
                    className="recipe-card"
                    onClick={() => navigate(`/recipes/${item._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                  <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.title}
                    />
                    <h4>{item.title}</h4>
                    <p>
                      {item.time} • ⭐ {item.rating}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ padding: "20px" }}>Belum ada rekomendasi.</p>
              )}
            </div>
          </div>

          <div className="recipes-section">
            <h3>Resep Populer 🔥</h3>

            <div className="recipes-grid">
              {popularRecipes.length > 0 ? (
                popularRecipes.map((item) => (
                  <div
                    key={item._id}
                    className="recipe-card"
                    onClick={() => navigate(`/recipes/${item._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.title}
                    />
                    <h4>{item.title}</h4>
                    <p>
                      {item.time} • ⭐ {item.rating}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ padding: "20px" }}>Belum ada resep populer.</p>
              )}
            </div>
          </div>

          <div className="footer">
            <p>© 2026 RecipeHub</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;