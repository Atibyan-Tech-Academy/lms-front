import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";

const InstructorLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar />
      <div
        style={{
          background: "linear-gradient(to right, #04CE65, #026833)",
          width: "100%",
          textAlign: "center",
          padding: "20px",
          color: "white",
        }}
      >
        <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      </div>
      <div className="max-w-screen-xl mx-auto p-6">{children}</div>
    </div>
  );
};

export default InstructorLayout;
