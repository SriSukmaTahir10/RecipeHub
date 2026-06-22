import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: "",
    foodPreference: "normal",
  });

  const token = localStorage.getItem("token");

  const loadProfile = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    try {
      await axios.put(
        `${API_URL}/profile`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      alert("Profil berhasil diperbarui");
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      <Navbar />

      <div className="profile-container">
      <div className="profile-box">
        <h2>Profil Saya</h2>

        <label>Nama</label>
        <input
          value={user.name}
          onChange={(e) =>
            setUser({
              ...user,
              name: e.target.value,
            })
          }
        />

        <label>Email</label>
        <input
          value={user.email}
          disabled
        />

        <label>Umur</label>
        <input
          type="number"
          value={user.age}
          onChange={(e) =>
            setUser({
              ...user,
              age: e.target.value,
            })
          }
        />

        <label>Preferensi Makanan</label>
        <select
          value={user.foodPreference}
          onChange={(e) =>
            setUser({
              ...user,
              foodPreference: e.target.value,
            })
          }
        >
          <option value="normal">Normal</option>
          <option value="diet">Diet</option>
          <option value="protein">Protein</option>
          <option value="vegetarian">Vegetarian</option>
        </select>

        <div className="profile-actions">
          <button
            className="save-profile-btn"
            onClick={handleSave}
            >
              Simpan Perubahan
          </button>

          <button
            className="logout-profile-btn"
            onClick={logout}
            >
              Logout
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Profile;