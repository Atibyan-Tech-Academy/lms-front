import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StudentLayout from "./layouts/StudentLayout";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorLayout from "./layouts/InstructorLayout";
<<<<<<< Updated upstream
import AdminDashboard from "./pages/AdminDashboard";
=======
import AdminLayout from "./layouts/AdminLayout";
import MyCourses from "./pages/MyCourses";
import CreateCourse from "./pages/CreateCourse";
import NotePages from "./pages/NotePages"; // ✅ Added NotesPage
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
            <StudentDashboard />
=======
            <Navigate to="/student/dashboard" />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/dashboard"
        element={
          <PrivateRoute roleCheck={["STUDENT"]}>
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/student/notes"
        element={
          <PrivateRoute roleCheck={["STUDENT"]}>
            <StudentLayout>
              <NotePages /> {/* ✅ Notes Page route */}
            </StudentLayout>
>>>>>>> Stashed changes
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