// src/components/Footer.jsx
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* First Column - Company Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Atibyan Tech Academy</h2>
          <p className="text-sm leading-relaxed">
            Building the future of tech by equipping students with hands-on
            skills and real-world experience.
          </p>
        </div>

        {/* Second Column - Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="https://aoitech.ng/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                About At-Tibyan
              </a>
            </li>
            <li>
              <a
                href="/faqs"
                className="hover:text-white transition-colors"
              >
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Third Column - Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm">123 Atibyan Street, Tech City, Nigeria</p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.facebook.com/atibyantechacademy/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://x.com/atibyan_tech/status/1749768401558392972"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/atibyan_tech?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A96066955&keywords=atibyan%20tech%20academy&origin=RICH_QUERY_SUGGESTION&position=2&sid=Ad5"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Atibyan Tech Academy. All rights reserved.
      </div>
    </footer>
  );
}