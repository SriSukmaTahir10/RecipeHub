import { useNavigate } from "react-router-dom";
import search from "../assets/images/search.png";

function NavbarRecipes({ searchTerm = "", onSearchChange = () => {} }) {
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

      <button className="filter-btn">⚙️ Filter</button>
    </div>
  );
}

export default NavbarRecipes;