"use client";

import { ReactNode } from "react";
import Topbar from "@/layout/admin-panel/Topbar";
import Sidebar from "@/layout/admin-panel/Sidebar";

const Adminlayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="lg:ml-64 min-h-screen">
        <Topbar />

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Adminlayout;