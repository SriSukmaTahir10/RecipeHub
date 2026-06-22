import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function AdminAddRecipe() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    category: "",
    time: "",
    difficulty: "",
    recommendationType: "normal",
    image: null,
    ingredientsText: "",
    stepsText: "",
  });

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/recipes/${id}`)
        .then((response) => {
          const data = response.data;

          setForm({
            title: data.title || "",
            category: data.category || "",
            time: data.time || "",
            difficulty: data.difficulty || "",
            recommendationType:
              data.recommendationType || "normal",
            image: null,
            ingredientsText: (data.ingredients || []).join("\n"),
            stepsText: (data.steps || []).join("\n"),
          });
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("time", form.time);
      formData.append("difficulty", form.difficulty);
      formData.append(
        "recommendationType",
        form.recommendationType
      );

      if (form.image) {
        formData.append("image", form.image);
      }

      formData.append(
        "ingredients",
        JSON.stringify(
          form.ingredientsText
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      formData.append(
        "steps",
        JSON.stringify(
          form.stepsText
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      if (id) {
        await axios.put(
          `${API_URL}/recipes/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        alert("Resep berhasil diperbarui!");
      } else {
        await axios.post(
          `${API_URL}/recipes`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        alert("Resep berhasil disimpan!");
      }

      navigate("/admin/recipes");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server tidak terhubung");
      }
    }
  };

  return (
    <div className="admin-main">
      <div className="form-box">
        <h2>{id ? "Edit Resep" : "Tambah Resep"}</h2>

        <div className="form-grid">
          <div>
            <label>Judul Resep</label>
            <input
              name="title"
              placeholder="Masukkan judul resep"
              onChange={handleChange}
              value={form.title}
            />

            <label>Kategori</label>
            <select
              name="category"
              onChange={handleChange}
              value={form.category}
            >
              <option value="">Pilih Kategori</option>
              <option value="Makanan Berat">Makanan Berat</option>
              <option value="Sayuran">Sayuran</option>
              <option value="Aneka Kue">Aneka Kue</option>
              <option value="Minuman">Minuman</option>
              <option value="Cemilan">Cemilan</option>
            </select>

            <label>Waktu Memasak</label>
            <input
              name="time"
              placeholder="Contoh 30 menit"
              onChange={handleChange}
              value={form.time}
            />

            <label>Tingkat Kesulitan</label>
            <select
              name="difficulty"
              onChange={handleChange}
              value={form.difficulty}
            >
              <option value="">Pilih tingkat kesulitan</option>
              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sulit">Sulit</option>
            </select>

            <label>Tipe Rekomendasi</label>
            <select
              name="recommendationType"
              onChange={handleChange}
              value={form.recommendationType}
            >
              <option value="normal">Normal</option>
              <option value="diet">Diet</option>
              <option value="protein">Protein Tinggi</option>
              <option value="vegetarian">Vegetarian</option>
            </select>
          </div>

          <div>
            <label>Gambar Resep</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.files[0],
                })
              }
            />

            <label>Bahan-bahan</label>
            <textarea
              name="ingredientsText"
              placeholder="Masukkan bahan per baris..."
              onChange={handleChange}
              value={form.ingredientsText}
            />

            <label>Langkah Memasak</label>
            <textarea
              name="stepsText"
              placeholder="Masukkan langkah memasak per baris..."
              onChange={handleChange}
              value={form.stepsText}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="save-btn"
            onClick={handleSubmit}
            type="button"
          >
            {id ? "Perbarui" : "Simpan"}
          </button>

          <button
            className="cancel-btn"
            onClick={() => navigate("/admin/recipes")}
            type="button"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminAddRecipe;