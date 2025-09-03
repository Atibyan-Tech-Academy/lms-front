import React, { useEffect } from "react";
import { initFlowbite } from "flowbite";
import banner from "../assets/banner.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import banner4 from "../assets/banner4.jpg";
import banner5 from "../assets/banner5.jpg";
import banner6 from "../assets/banner6.jpg";

const Carousel = () => {
  // Initialize Flowbite JS on mount
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div>
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="slide"
        data-carousel-interval="5000"
      >
        {/* Carousel wrapper */}
        <div className="relative h-[500px] overflow-hidden rounded-lg md:h-[900px]">
          {/* Item 1 */}
          <div className="w-full h-full">
          <div className="duration-700 ease-in-out" data-carousel-item="active">
            <img
              src={banner}
              className="block w-full h-full object-cover"
              alt="Slide 1"
            />
          </div>
          </div>
          {/* Item 2 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img
              src={banner2}
              className="block w-full h-full object-cover"
              alt="Slide 2"
            />
          </div>
          {/* Item 3 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img
              src={banner3}
              className="block w-full h-full object-cover"
              alt="Slide 3"
            />
          </div>
          {/* Item 4 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img
              src={banner4}
              className="block w-full h-full object-cover"
              alt="Slide 4"
            />
          </div>
          {/* Item 5 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img
              src={banner5}
              className="block w-full h-full object-cover"
              alt="Slide 5"
            />
          </div>
          {/* Item 6 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img
              src={banner6}
              className="block w-full h-full object-cover"
              alt="Slide 6"
            />
          </div>
        </div>

        {/* Slider indicators */}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
=======
        <div className="absolute  flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
>>>>>>> Stashed changes
=======
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
>>>>>>> Stashed changes
=======
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
>>>>>>> Stashed changes
=======
        <div className="absolute  flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
>>>>>>> Stashed changes
=======
        <div className="absolute  flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
>>>>>>> Stashed changes
          {[...Array(6)].map((_, i) => (
            <button
              key={i}
              type="button"
              className="w-3 h-3 rounded-full"
              aria-label={`Slide ${i + 1}`}
              data-carousel-slide-to={i}
            ></button>
          ))}
        </div>

        {/* Slider controls */}
        <button
          type="button"
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
=======
          className="absolute top-0 start-0  flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
>>>>>>> Stashed changes
=======
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
>>>>>>> Stashed changes
=======
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
>>>>>>> Stashed changes
=======
          className="absolute top-0 start-0  flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
>>>>>>> Stashed changes
=======
          className="absolute top-0 start-0  flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
>>>>>>> Stashed changes
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>

        <button
          type="button"
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
=======
          className="absolute top-0 end-0  flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
>>>>>>> Stashed changes
=======
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
>>>>>>> Stashed changes
=======
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
>>>>>>> Stashed changes
=======
          className="absolute top-0 end-0  flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
>>>>>>> Stashed changes
=======
          className="absolute top-0 end-0  flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
>>>>>>> Stashed changes
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;