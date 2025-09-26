import { useEffect, useState } from "react";
import { getProfile } from "../services/api";

const DashboardNavbar = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || null);

  // Fetch profile when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data);

        if (data.profile_picture) {
          setAvatar(data.profile_picture);
          localStorage.setItem("avatar", data.profile_picture);
        } else {
          setAvatar(null);
          localStorage.removeItem("avatar");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="navbar">
      <div className="flex items-center space-x-4">
        <span className="font-semibold">
          {user ? user.display_name || user.username : "Loading..."}
        </span>
        {avatar ? (
          <img
            src={avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
            {user ? user.initials : "U"}
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;
