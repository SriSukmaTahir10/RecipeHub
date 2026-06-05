import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";

function AdminRecipes() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    axios
      .get("http://localhost:5000/recipes")
      .then((response) => setRecipes(response.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus resep ini?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      setRecipes((prev) => prev.filter((item) => item._id !== id));
      alert("Resep berhasil dihapus!");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Gagal menghapus resep");
      }
    }
  };

  return (
    <div className="admin-wrapper">
      <div className={`sidebar-overlay ${showSidebar ? "show" : ""}`}>
        <SidebarAdmin close={() => setShowSidebar(false)} />
      </div>

      <div className="admin-main">
        <button
          className="toggle-btn"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰
        </button>

        <div className="dashboard-box">
          <div className="header-row">
            <h2>Kelola Resep</h2>
            <button
              className="add-btn"
              onClick={() => navigate("/admin/recipes/add")}
            >
              + Tambah Resep
            </button>
          </div>

          <table className="recipe-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Judul Resep</th>
                <th>Kategori</th>
                <th>Waktu</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {recipes.length > 0 ? (
                recipes.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.time}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/admin/recipes/edit/${item._id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item._id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Belum ada resep
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminRecipes;