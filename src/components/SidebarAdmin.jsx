import { useNavigate } from "react-router-dom";

function SidebarAdmin({ close }) {
    const navigate = useNavigate();
  return (
    <div className="sidebar">

      {/* tombol close */}
      <button className="close-btn" onClick={close}>
        ✖
      </button>

      <h2 className="logo">RecipeHub</h2>

      <ul>
        <li onClick={() => navigate("/admin/dashboard")}>Dashboard</li>

        <li onClick={() => navigate("/admin/recipes")}>
          Resep
        </li>

        <li onClick={() => navigate("/admin/category")}>
            Kategori
        </li>

        <li onClick={() => navigate("/admin/user")}>
            User
        </li>

        <li>Komentar</li>
        <li>Pengaturan</li>
        <li>Log Out</li>
      </ul>

    </div>
  );
}

export default SidebarAdmin;