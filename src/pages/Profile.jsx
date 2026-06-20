import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: "",
    foodPreference: "normal",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/profile",
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
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/profile",
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
          <option value="vegetarian">
            Vegetarian
          </option>
        </select>

        <button onClick={handleSave}>
          Simpan Perubahan
        </button>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;