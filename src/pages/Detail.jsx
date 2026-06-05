import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

  // ambil detail resep
  useEffect(() => {
    axios
      .get(`http://localhost:5000/recipes/${id}`)
      .then((response) => setRecipe(response.data))
      .catch((err) => console.log(err));

    // tambah jumlah view resep
    axios.patch(`http://localhost:5000/recipes/${id}/view`).catch((err) => console.log(err));
  }, [id]);

  // simpan ke favorite
  const handleSave = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (!savedUser) {
        alert("Silakan login terlebih dahulu!");
        return;
      }

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/favorites",
        {
          recipeId: recipe._id,
          recipeData: recipe,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Resep berhasil disimpan!");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server tidak terhubung");
      }
    }
  };

  if (!recipe) return <h2>Loading...</h2>;

  return (
    <div className="container">
      <Navbar />

      <p className="back" onClick={() => navigate(-1)}>
        ← Kembali
      </p>

      <div className="detail-container">
        <div className="detail-left">
          <img
            src={
            recipe.image?.startsWith("/images")
            ? recipe.image
            : `http://localhost:5000/uploads/${recipe.image}`
            }
              alt={recipe.title}
          />
        </div>

        <div className="detail-right">
          <h2>{recipe.title}</h2>
          <p className="rating">⭐ {recipe.rating}</p>
          <p className="time">⏱ {recipe.time}</p>

          <h4>Bahan-bahan</h4>
          <ul>
            {recipe.ingredients?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <div className="action-buttons">
            <button className="save-btn" onClick={handleSave}>
              Simpan Resep
            </button>
            <button className="share-btn">Bagikan</button>
          </div>
        </div>
      </div>

      <div className="steps">
        <h4>Langkah Memasak</h4>
        <ol>
          {recipe.steps?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Detail;