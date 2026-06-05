import { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";

function AdminCategory() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/recipes")
      .then((response) => {
        const data = response.data;

        const categoryCount = data.reduce((acc, item) => {
          const cat = item.category?.trim() || "Tanpa Kategori";
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});

        const categoryArray = Object.entries(categoryCount).map(
          ([name, total], index) => ({
            no: index + 1,
            name,
            total,
          })
        );

        setCategories(categoryArray);
      })
      .catch((err) => console.log(err));
  }, []);

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
            <h2>Kelola Kategori</h2>
            <button className="add-btn">+ Tambah Kategori</button>
          </div>

          <table className="recipe-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Kategori</th>
                <th>Jumlah Resep</th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((item) => (
                  <tr key={item.no}>
                    <td>{item.no}.</td>
                    <td>{item.name}</td>
                    <td>{item.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    Belum ada data kategori
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

export default AdminCategory;