import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  return (
    <div className="card">
      <img src={recipe.image} alt="" />
      <h3>{recipe.title}</h3>

      <Link to={`/detail/${recipe.id}`} style={{ padding: 10 }}>
        Lihat Detail
      </Link>
    </div>
  );
}

export default RecipeCard;