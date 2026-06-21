"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster position="top-right" richColors /> {children}
    </ThemeProvider>
  );
};

export default providers;
