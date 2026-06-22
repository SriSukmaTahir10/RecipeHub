import { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../App.css";
import { API_URL } from "../config";

function AdminDashboard() {
  const [showSidebar, setShowSidebar] = useState(false);

  // data dashboard dari backend
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipesRequest = axios.get(`${API_URL}/recipes`);

        const usersRequest = axios.get(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        const [recipesResult, usersResult] = await Promise.allSettled([
          recipesRequest,
          usersRequest,
        ]);

        if (recipesResult.status === "fulfilled") {
          setRecipes(recipesResult.value.data);
        } else {
          console.error("Gagal mengambil resep:", recipesResult.reason);
        }

        if (usersResult.status === "fulfilled") {
          setUsers(usersResult.value.data);
        } else {
          console.error("Gagal mengambil user:", usersResult.reason);
          setUsers([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchData();
  }, [adminToken]);

  // total kategori unik
  const totalCategories = new Set(
    recipes.map((item) => item.category?.trim()).filter(Boolean)
  ).size;

  // resep terbaru dari database
  const latestRecipes = [...recipes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

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
          <h2>Dashboard</h2>

          <div className="stats">
            <div className="stat-card">
              Total Resep<br />
              <b>{recipes.length}</b>
            </div>

            <div className="stat-card">
              Total User<br />
              <b>{users.length}</b>
            </div>

            <div className="stat-card">
              Total Kategori<br />
              <b>{totalCategories}</b>
            </div>

            <div className="stat-card">
              Total Komentar<br />
              <b>0</b>
            </div>
          </div>

          <div className="latest-box">
            <div className="latest-header">
              <h3>Resep Terbaru</h3>
              <span className="latest-badge">{latestRecipes.length} Data</span>
            </div>

            <div className="latest-list">
              {latestRecipes.length > 0 ? (
                latestRecipes.map((item) => (
                  <div key={item._id} className="latest-card">
                    <div className="latest-thumb">
                      <img
                        src={item.image}
                        alt={item.title}
                      />
                    </div>

                    <div className="latest-info">
                      <h4>{item.title}</h4>
                      <p>{item.category}</p>
                      <span>⏱ {item.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="latest-empty">Belum ada resep</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;