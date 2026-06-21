"use client";

import SingleBlogPage from "@/components/SingleBlogPage";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const Blog = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticate } = useAuthStore();
  const isHydrated = useAuthStore.persist.hasHydrated();

  useEffect(() => {
    if (isHydrated && !isAuthenticate) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isHydrated, isAuthenticate, pathname, router]);

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticate) {
    return null;
  }

  return <SingleBlogPage />;
};

export default Blog;
