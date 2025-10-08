import React, { useState } from "react";
import { getCourse, markAsComplete } from "../../services/api"; // Adjusted path

export default function Settings({ profile, setProfile, updateUser, setError }) {
  const [settings, setSettings] = useState({
    emailNotifications: profile?.email_notifications ?? true,
    darkMode: profile?.dark_mode ?? false,
  });

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(settings);
      setProfile(prev => ({ ...prev, ...settings }));
      updateUser(settings);
      alert("Settings updated successfully!");
    } catch (err) {
      setError("Failed to update settings: " + err.message);
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2">Preferences</h3>
        <form onSubmit={handleSettingsUpdate}>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => toggleSetting("emailNotifications")}
                className="mr-2"
              />
              Receive Email Notifications
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => toggleSetting("darkMode")}
                className="mr-2"
              />
              Enable Dark Mode
            </label>
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}