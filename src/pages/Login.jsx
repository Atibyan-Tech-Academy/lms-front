import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/Aoi-portal .png";
import { boxShadow } from "flowbite-react/plugin/tailwindcss/theme";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("login/", form);

      // save tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // get user profile to know role
      const profile = await API.get("profile/");
      localStorage.setItem("role", profile.data.role);

      if (profile.data.role === "STUDENT") {
        navigate("/student");
      } else if (profile.data.role === "INSTRUCTOR") {
        navigate("/instructor");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      alert("Invalid login credentials");
    }
  };

  return (
<<<<<<< Updated upstream
    <main className="m-auto">
     
    <section  class="w-1/2 m-auto grid grid-col-2 ">
      
    <div className="flex items-center justify-center min-h-screen place-content-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 h-96 place-content-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          name="identifier"
          placeholder="Student ID / Lecturer ID / Email"
          value={form.identifier}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
=======
    <div className="flex h-screen m-3">
      <div className="w-1/2 flex flex-col justify-center px-16 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Email / Student ID / Lecturer ID</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or ID"
              className="mb-3 w-full p-3 border rounded-lg focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-3 bg-green-800 text-white rounded-lg hover:bg-green-500 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <div className="w-1/2 bg-blue-900 flex items-center justify-center bg-image">
        <div className="text-center text-white px-6">
          <img
            src={logoLight}
            alt="AT-TIBYAN TECH ACADEMY"
            className="rounded-xl shadow-lg mb-6 mx-auto"
          />
          <h1 className="text-2xl font-bold">AT-TIBYAN TECH ACADEMY</h1>
          <p className="mt-2 text-lg">
            Transform Your Career with At-Tibyan Tech Academy
          </p>
        </div>
      </div>
>>>>>>> Stashed changes
    </div>

   <div className="flex justify-center items-center min-h-screen ">
   <img
      src={image2}
      alt="Overlay"
      className=" w-60 h-full object-contain z-10 opacity-80 "
    />
    <div style={{backgroundColor:"#00000067"}} className=" w-full h-full bg--500 z-10" />
    {/* Overlay Image */}
   
  
    {/* Background Image */}
    <img
      src={image1}
      alt="Background"
      className=" w-full h-full object-cover z-0"
    />
</div>
  
</section>



    </main>
  
    
    
  );
}