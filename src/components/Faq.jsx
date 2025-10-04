// src/components/Faq.jsx
import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is At-Tibyan Tech Academy?",
      answer:
        "At-Tibyan Tech Academy is a leading educational institution dedicated to providing hands-on tech skills and real-world experience to students, empowering them to transform their careers.",
    },
    {
      question: "How do I enroll in a course?",
      answer:
        "To enroll, visit the 'Courses' section, select your desired course, and click 'Enroll'. You’ll need to log in or register if you’re a new user. Follow the prompts to complete the process.",
    },
    {
      question: "What are the system requirements?",
      answer:
        "You need a stable internet connection, a modern web browser (e.g., Chrome, Firefox), and a device (PC, tablet, or smartphone) with at least 4GB RAM for optimal performance.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach our support team via email at support@atibyantech.ng or through the 'Contact' section on our website. We’re available Monday to Friday, 9 AM - 5 PM WAT.",
    },
    {
      question: "Are there any certification programs?",
      answer:
        "Yes, we offer certification programs upon completion of courses. Check the course details for eligibility and requirements.",
    },
     {
      question: "What is this platform used for?",
      answer:
        "This platform helps students access courses, track progress, interact with instructors, and manage their learning in one place.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Absolutely. We use industry-standard encryption and security measures to keep your data safe.",
    },
      {
      question: "How do I contact support if I face an issue?",
      answer:
        "You can reach out to the support team via the “Help & Support” section in the dashboard.",
    },
     {
      question: "Can instructors upload their own courses?",
      answer:
        "Yes, instructors can create and manage courses, upload materials, assignments, and quizzes through their instructor dashboard.",
    },
     {
      question: "Can I access the platform on mobile devices?",
      answer:
        "After signing in, go to the “Courses” section, select your desired course, and click “Enroll.” Some courses may require admin approval.",
    },
  ];

  return (
    <div>
      <Navbar></Navbar>
    <div className="max-w-4xl mt-5 mx-auto py-12 px-4" style={{marginTop:"50px"}}>
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left p-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {faq.question}
              <span className="float-right">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="p-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <Footer></Footer>
    </div>
  );
}