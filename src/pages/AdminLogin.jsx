import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function AdminLogin() {
  const navigate = useNavigate();

  // state form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // login admin ke backend
  const handleLogin = async () => {
    try {
      
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password,
      });

      const data = response.data;

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      alert("Login admin berhasil!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server tidak terhubung");
      }
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 style={{ color: "orange" }}>RecipeHub</h2>
        <h3>Login Admin</h3>

        <label>Email</label>
        <input
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;