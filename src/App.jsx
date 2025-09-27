import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Login2 from "./pages/Login2";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
<<<<<<< Updated upstream
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login2" element={<Login2 />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
=======
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/editprofile" element={<EditProfile />} />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <PrivateRoute roleCheck={["STUDENT"]}>
            <Navigate to="/student/dashboard" />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/dashboard"
        element={
          <PrivateRoute roleCheck={["STUDENT"]}>
            <StudentLayout>
              {/* <StudentDashboard /> */}
            </StudentLayout>
          </PrivateRoute>
        }
      />

      {/* Instructor Routes */}
      <Route
        path="/instructor"
        element={
          <PrivateRoute roleCheck={["LECTURER"]}>
            <Navigate to="/instructor/dashboard" />
          </PrivateRoute>
        }
      />
      <Route
        path="/instructor/dashboard"
        element={
          <PrivateRoute roleCheck={["LECTURER"]}>
            <InstructorLayout>
              <InstructorDashboard />
            </InstructorLayout>
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute roleCheck={["ADMIN"]}>
            <Navigate to="/admin/dashboard" />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute roleCheck={["ADMIN"]}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
>>>>>>> Stashed changes
  );
}

export default App;