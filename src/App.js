import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Recipes from "./pages/Recipes";
import Detail from "./pages/Detail";
import MyRecipes from "./pages/MyRecipes";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRecipes from "./pages/AdminRecipes";
import AdminAddRecipe from "./pages/AdminAddRecipe";
import AdminCategory from "./pages/AdminCategory";
import AdminUser from "./pages/AdminUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<Detail />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/recipes" element={<AdminRecipes />} />
        <Route path="/admin/recipes/add" element={<AdminAddRecipe />} />
        <Route path="/admin/recipes/edit/:id" element={<AdminAddRecipe />} />
        <Route path="/admin/category" element={<AdminCategory />} />
        <Route path="/admin/user" element={<AdminUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;