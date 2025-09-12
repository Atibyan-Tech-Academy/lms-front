import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StudentLayout from "./layouts/StudentLayout";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorLayout from "./layouts/InstructorLayout";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
<<<<<<< Updated upstream
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
=======
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/InstructorLayout" element={<InstructorLayout />} />
      <Route path="/StudentLayout" element={<StudentLayout />} />


      {/* Protected */}
      <Route
        path="/student"
        element={
          <PrivateRoute roleCheck={["STUDENT"]}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/instructor"
        element={
          <PrivateRoute roleCheck={["LECTURER"]}>
            <InstructorDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute roleCheck={["ADMIN"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
>>>>>>> Stashed changes
  );
}

export default App;