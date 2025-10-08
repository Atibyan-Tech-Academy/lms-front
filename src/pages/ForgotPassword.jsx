import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendResetCode, verifyResetCode, resetPassword, getCsrfToken } from "../services/api";
import logoLight from "../assets/Aoi2-light.png"; // Update path if needed
import image1 from "../assets/image1.jpg"; // Fallback image
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageError = (e) => {
    console.error("Logo image load failed:", { url: e.target.src });
    e.target.src = image1;
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
      toast.success("Verification code sent to your email!");
      setStep("verify");
    } catch (err) {
      console.error("Send code error:", err);
      const errorMsg = err.response?.data?.email?.[0] || err.response?.data?.detail || "Failed to send verification code.";
      toast.error(errorMsg);
      setError(errorMsg);
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
      toast.success("Code verified successfully!");
      setStep("reset");
    } catch (err) {
      console.error("Verify code error:", err);
      const errorMsg = err.response?.data?.detail || "Invalid or expired verification code.";
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      const mismatchMsg = "Passwords do not match.";
      toast.error(mismatchMsg);
      setError(mismatchMsg);
      return;
    }
    if (newPassword.length < 8) {
      const lengthMsg = "Password must be at least 8 characters long.";
      toast.error(lengthMsg);
      setError(lengthMsg);
      return;
    }
    setError(null);
    setLoading(true);
    console.log("Resetting password for email:", email);

    try {
      const csrfToken = await getCsrfToken();
      await resetPassword({ email, code, new_password: newPassword }, csrfToken);
      console.log("Password reset successful");
      toast.success("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMsg = err.response?.data?.detail || "Failed to reset password.";
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  let formContent;

  if (step === "email") {
    formContent = (
      <form onSubmit={handleSendCode} className="space-y-5">
        <div className="mb">
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
      <div className="w-1/2 flex flex-col justify-center px-16 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Reset Password</h2>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mb-3">{error}</p>}
        {formContent}
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/login" className="text-blue-500 hover:underline">Back to Login</Link>
        </p>
      </div>
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
      <ToastContainer />
    </div>
  );
}