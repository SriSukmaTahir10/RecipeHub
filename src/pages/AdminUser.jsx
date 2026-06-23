import { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import { API_URL } from "../config";

function AdminUser() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [users, setUsers] = useState([]);

  const adminToken = localStorage.getItem("adminToken");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus user ini?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setUsers(
        users.filter(
          (user) => user._id !== id
        )
      );

      alert("User berhasil dihapus");
    } catch (error) {
      console.error(error);

      if (
        error.response?.data?.message ===
        "Token expired / tidak valid"
      ) {
        alert(
          "Session admin habis. Silakan login kembali."
        );

        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        window.location.href =
          "/admin/login";

        return;
      }

      alert("Gagal menghapus user");
    }
  };

  useEffect(() => {
    if (!adminToken) {
      window.location.href =
        "/admin/login";
      return;
    }

    axios
      .get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.error(err);

        if (
          err.response?.data?.message ===
          "Token expired / tidak valid"
        ) {
          alert(
            "Session admin habis. Silakan login kembali."
          );

          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "admin"
          );

          window.location.href =
            "/";

          return;
        }

        setUsers([]);
      });
  }, [adminToken]);

  return (
    <div className="admin-wrapper">
      <div
        className={`sidebar-overlay ${
          showSidebar ? "show" : ""
        }`}
      >
        <SidebarAdmin
          close={() =>
            setShowSidebar(false)
          }
        />
      </div>

      <div className="admin-main">
        <button
          className="toggle-btn"
          onClick={() =>
            setShowSidebar(
              !showSidebar
            )
          }
        >
          ☰
        </button>

        <div className="dashboard-box">
          <h2>Kelola User</h2>

          <table className="recipe-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Tanggal Daftar</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map(
                  (item, index) => (
                    <tr
                      key={item._id}
                    >
                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {item.name}
                      </td>

                      <td>
                        {item.email}
                      </td>

                      <td>
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString(
                              "id-ID"
                            )
                          : "-"}
                      </td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    Belum ada user
                    terdaftar
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

export default AdminUser;