
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";


  export default function Home() {
    
    return (
    <div>
        
        <Navbar/>
        <Carousel/>
    
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-4xl font-bold mb-6">Welcome to AOI Academy LMS</h1>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Register
            </Link>
          </div>
        </div>
    </div>
  );
}