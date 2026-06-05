function Sidebar({ closeSidebar }) {
  return (
    <div className="sidebar">

      {/* HEADER SIDEBAR */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>RecipeHub</h2>
        <span 
          style={{ cursor: "pointer", fontSize: "20px" }}
          onClick={closeSidebar}
        >
          ❌
        </span>
      </div>

      <p>Dashboard</p>
      <p>Resep</p>
      <p>Kategori</p>
      <p>User</p>
      <p>Komentar</p>
      <p>Pengaturan</p>
      <p>Log Out</p>
    </div>
  );
}

export default Sidebar;