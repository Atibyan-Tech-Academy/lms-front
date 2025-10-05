import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      await axios.post("http://127.0.0.1:8000/api/support/submit/", formData);
      setFeedback("✅ Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setFeedback("❌ Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main><Navbar />
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6 mt-5" style={{marginTop:"50px"}}>
      <div className="max-w-xl w-full bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Contact Technical Support
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            {/* <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label> */}
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full mb-4 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            {/* <label className="block text-gray-700 font-medium mb-1">
              Email
            </label> */}
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-4 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            {/* <label className="block text-gray-700 font-medium mb-1">
              Subject
            </label> */}
            <input
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full mb-4 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter subject of your issue"
            />
          </div>

          <div>
            {/* <label className="block text-gray-700 font-medium mb-1">
              Message
            </label> */}
            <textarea
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full mb-4  border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="5"
              placeholder="Describe your issue in detail..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mb-4 bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {feedback && (
          <p className="mt-4 text-center font-medium text-gray-700">{feedback}</p>
        )}
      </div>
    </div>
    <Footer />
    </main>
  );
}
