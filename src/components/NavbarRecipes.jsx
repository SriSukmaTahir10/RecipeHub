import { useNavigate } from "react-router-dom";
import search from "../assets/images/search.png";

function NavbarRecipes({
  searchTerm = "",
  onSearchChange = () => {},
  selectedCategory = "",
  onCategoryChange = () => {},
}) {
  const navigate = useNavigate();

  return (
    <div className="navbar-recipes">
      <div className="logo" onClick={() => navigate("/home")}>
        RecipeHub
      </div>

      <div className="search-bar-recipes">
        <img src={search} alt="search" />
        <input
          type="text"
          placeholder="Cari Resep....."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <img src={search} alt="search" />
      </div>

      <select
  className="filter-btn"
  value={selectedCategory}
  onChange={(e) =>
    onCategoryChange(e.target.value)
  }
>
  <option value="">
    Semua Kategori
  </option>

  <option value="Makanan Berat">
    Makanan Berat
  </option>

  <option value="Sayuran">
    Sayuran
  </option>

  <option value="Aneka Kue">
    Aneka Kue
  </option>

  <option value="Minuman">
    Minuman
  </option>

  <option value="Cemilan">
    Cemilan
  </option>
</select>
    </div>
  );
}

export default NavbarRecipes;