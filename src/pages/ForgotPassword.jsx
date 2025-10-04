import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendResetCode, verifyResetCode, resetPassword, getCsrfToken } from "../services/api";
import logoLight from "../assets/Aoi2-light.png";
import image1 from "../assets/image1.jpg"; // Add a fallback image

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // Steps: 'email' -> 'verify' -> 'reset'
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageError = (e) => {
    console.error("Logo image load failed:", { url: e.target.src });
    e.target.src = placeholderImage; // Fallback to placeholder
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("Sending verification code for email:", email);

    try {
      const csrfToken = await getCsrfToken();
      await sendResetCode({ email }, csrfToken);
      console.log("Verification code sent, moving to verify step");
      setStep("verify");
    } catch (err) {
      console.error("Send code error:", err);
      setError(
        "Error sending verification code: " +
          (err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("Verifying code:", code);

    try {
      const csrfToken = await getCsrfToken();
      await verifyResetCode({ email, code }, csrfToken);
      console.log("Code verified, moving to reset step");
      setStep("reset");
    } catch (err) {
      console.error("Verify code error:", err);
      setError(
        "Invalid verification code: " +
          (err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      console.log("Password mismatch");
      return;
    }
    setError(null);
    setLoading(true);
    console.log("Resetting password for email:", email);

    try {
      const csrfToken = await getCsrfToken();
      await resetPassword({ email, code, new_password: newPassword }, csrfToken);
      console.log("Password reset successful");
      alert("Password reset successful. Please log in with your new password.");
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        "Error resetting password: " +
          (err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  let formContent;

  if (step === "email") {
    formContent = (
      <form onSubmit={handleSendCode} className="space-y-5">
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition dark:bg-green-900 dark:hover:bg-green-800"
        >
          {loading ? "Sending..." : "Send Verification Code"}
        </button>
      </form>
    );
  } else if (step === "verify") {
    formContent = (
      <form onSubmit={handleVerifyCode} className="space-y-5">
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter the code sent to your email"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition dark:bg-green-900 dark:hover:bg-green-800"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>
    );
  } else if (step === "reset") {
    formContent = (
      <form onSubmit={handleResetPassword} className="space-y-5">
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition dark:bg-green-900 dark:hover:bg-green-800"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    );
  }

  return (
    <div className="flex h-screen m-3">
      {/* Left side form */}
      <div className="w-1/2 flex flex-col justify-center px-16 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Reset Password</h2>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mb-3">{error}</p>}
        {formContent}
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/login" className="text-blue-500 hover:underline">Back to Login</Link>
        </p>
      </div>

      {/* Right side image */}
      <div className="w-1/2 bg-blue-900 flex items-center justify-center bg-image">
        <div className="text-center text-white px-6">
          <img
            src={logoLight}
            alt="AT-TIBYAN TECH ACADEMY"
            className="rounded-xl shadow-lg mb-6 mx-auto"
            onError={handleImageError}
          />
          <h1 className="text-2xl font-bold">AT-TIBYAN TECH ACADEMY</h1>
          <p className="mt-2 text-lg">Transform Your Career with At-Tibyan Tech Academy</p>
        </div>
      </div>
    </div>
  );
}