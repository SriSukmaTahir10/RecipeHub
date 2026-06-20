import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/images/user.png";

function Navbar() {
    const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="nav-left" onClick={() => navigate("/home")}>
        RecipeHub
        </div>

      <div className="nav-menu">
        <span onClick={() => navigate("/home")}><b>Beranda</b></span>
        <span onClick={() => navigate("/my-recipes")}>
          Resep Saya
        </span>
      </div>

      <div
          className="profile"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
      >
      <img src={profileIcon} alt="profile" />
      </div>
      </div>
  );
}

export default Navbar;