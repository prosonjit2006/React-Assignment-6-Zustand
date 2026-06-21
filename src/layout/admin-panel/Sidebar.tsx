"use client";

import { LayoutDashboard, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    title: "Blog",
    icon: FileText,
    path: "/admin/blogs",
  },
];

const Sidebar = () => {
  const router = useRouter();
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-background">
      <div className="relative overflow-hidden p-6 border">
        <div className="absolute inset-0">
          <div className="absolute -left-1/2 top-0 h-full w-full rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-glare" />
        </div>

        <h1 className="relative text-xl font-bold text-black">BlogHub Admin</h1>
      </div>

      <nav className="space-y-2 px-4 py-4">
        {menus.map((item) => (
          <button
            key={item.title}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-muted transition-colors"
            onClick={() => router.push(item.path)}
          >
            <item.icon size={18} />
            {item.title}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
