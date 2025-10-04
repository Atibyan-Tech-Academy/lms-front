import React from "react";

export default function StudentLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">{children}</main>
    </div>
  );
}