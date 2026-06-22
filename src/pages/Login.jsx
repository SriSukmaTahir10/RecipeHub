import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import axios from "axios";
import "../App.css";
import { API_URL } from "../config";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // state form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [foodPreference, setFoodPreference] = useState("normal");

  // submit register/login ke backend
  const handleAuth = async () => {
    try {
      if (isLogin) {
        

        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });

        const data = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login berhasil!");
        navigate("/home");
      } else {
        // validasi register
        if (!name || !email || !password || !confirmPassword) {
          alert("Semua data harus diisi!");
          return;
        }

        if (password !== confirmPassword) {
          alert("Konfirmasi password tidak cocok!");
          return;
        }

        // register ke backend
        const response = await axios.post(`${API_URL}/auth/register`, {
          name,
          email,
          password,
          age,
          foodPreference,
        });

        const data = response.data;

        alert(data.message || "Pendaftaran berhasil!");
        setIsLogin(true);

        // reset form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server tidak terhubung");
      }
    }
  };

  const handleGoogleLogin = () => {
    alert("Login dengan Google");
  };

  const handleFacebookLogin = () => {
    alert("Login dengan Facebook");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <span
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </span>

          <span
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Daftar
          </span>
        </div>

        {!isLogin && (
          <div className="input-group">
            <label>Nama</label>
            <input
              type="text"
              placeholder="Masukkan nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {!isLogin && (
          <div className="input-group">
            <label>Konfirmasi Password</label>
            <input
              type="password"
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        <div className="input-group">
  <label>Umur</label>
  <input
    type="number"
    value={age}
    onChange={(e) => setAge(e.target.value)}
  />
</div>

<div className="input-group">
  <label>Preferensi Makanan</label>

  <select
    value={foodPreference}
    onChange={(e) =>
      setFoodPreference(e.target.value)
    }
  >
    <option value="normal">
      Normal
    </option>

    <option value="diet">
      Diet
    </option>

    <option value="protein">
      Protein Tinggi
    </option>

    <option value="vegetarian">
      Vegetarian
    </option>
  </select>
</div>

        {isLogin && (
          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" /> Ingat saya
            </label>
            <span className="forgot-password">Lupa password?</span>
          </div>
        )}

        <button className="auth-btn" onClick={handleAuth} type="button">
          {isLogin ? "Login" : "Daftar"}
        </button>

        <div className="auth-social-section">
          <p className="auth-divider-text">atau masuk dengan</p>

          <div className="social-buttons">
            <button
              type="button"
              className="social-btn google"
              onClick={handleGoogleLogin}
              aria-label="Login dengan Google"
            >
              <FaGoogle />
            </button>

            <button
              type="button"
              className="social-btn facebook"
              onClick={handleFacebookLogin}
              aria-label="Login dengan Facebook"
            >
              <FaFacebookF />
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <span className="auth-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Daftar di sini" : "Login di sini"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;