"use client";

import { Menu, Moon, Sun, LogIn, LogOut, BookOpen } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

// import your zustand store
// import { useAuthStore } from "@/store/useAuthStore";

const navItems = [{ name: "Blogs", path: "/" }];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticate, logout } = useAuthStore();

  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();

    router.push("/");
  };

  // const isLoggedIn = !!username;

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <BookOpen size={22} />
          <span className="text-xl font-bold">BlogHub</span>
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`text-sm font-medium transition ${
                pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticate && user && (
            <AnimatedShinyText className="hidden  text-sm font-medium md:block">
              Welcome {user.name.trim().split(" ")[0]}
            </AnimatedShinyText>
            // <MorphingText
            //   className="hidden  text-sm font-medium md:block"
            //   texts={["Welcome", `${user.name}`]}
            // />

            // <span className="hidden  text-sm font-medium md:block">
            //   Welcome <span className="text-zinc-500">
            //     {user.name}
            //     </span>
            // </span>
          )}

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full border p-2 transition hover:bg-muted"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {!isAuthenticate ? (
            <button
              onClick={() => router.push("/login")}
              className="rounded-full border p-2 transition hover:bg-muted"
            >
              <LogIn size={18} />
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-full border p-2 transition hover:bg-muted"
            >
              <LogOut size={18} />
            </button>
          )}

          <button className="rounded-full border p-2 md:hidden">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
