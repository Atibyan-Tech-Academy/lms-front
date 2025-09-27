import React, { useEffect, useState } from "react";

import banner from "../assets/banner.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import banner4 from "../assets/banner4.jpg";
import banner5 from "../assets/banner5.jpg";
import banner6 from "../assets/banner6.jpg";

const images = [banner, banner2, banner3, banner4, banner5, banner6];
const titles = [
  "Welcome to Atibyan Student Portal",
  "Track Your Courses",
  "Interactive Learning",
  "Stay Connected",
  "Achieve Your Goals",
  "Access Anytime, Anywhere",
];
const subtitles = [
  "Your gateway to smarter learning and academic success.",
  "Stay organized with easy access to all your subjects and progress.",
  "Engage with modern tools that make studying easier and fun.",
  "Chat with classmates, ask questions, and get instant updates.",
  "Plan, learn, and grow with Atibyan’s digital support system.",
  "Study at your own pace with mobile and desktop support.",
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden rounded-lg">
      {/* Slides */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 animate-fadeInUp">
              {titles[index]}
            </h2>
            <p className="text-lg md:text-xl animate-fadeInUp delay-200">
              {subtitles[index]}
            </p>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + images.length) % images.length)
        }
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full"
      >
        ❮
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
