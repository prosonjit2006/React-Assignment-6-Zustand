"use client";

import BlogCard from "@/components/BlogCard";
import { BlurFade } from "@/components/ui/blur-fade";
import { SparklesText } from "@/components/ui/sparkles-text";
import { useBlogStore } from "@/store/useBlogStore";
import { motion } from "motion/react";
import { useEffect } from "react";

const HomePage = () => {
  const { blogs, fetchBlogs, isLoading, isError } = useBlogStore();

  console.log(blogs);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading Blogs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {isError}
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 py-10">
      {/* Hero */}

      <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="space-y-8"
        >
          <span className="rounded-full border px-4 py-2 text-sm text-muted-foreground">
            ✨ Welcome To BlogHub
          </span>

          <SparklesText className="max-w-5xl text-5xl font-bold md:text-7xl">
            Discover Stories, Ideas & Knowledge
          </SparklesText>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore insightful articles, tutorials and experiences written by
            passionate creators from around the world.
          </p>
        </motion.div>
      </section>

      {/* Blogs */}
      <section className="pb-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Latest Blogs</h2>

          <p className="mt-2 text-muted-foreground">
            Read our latest published articles.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            No Blogs Found
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <BlurFade key={blog.id} delay={index * 0.08} inView>
                <BlogCard
                  id={blog.id}
                  title={blog.title}
                  image_url={blog?.image ?? ""}
                  author={blog.author}
                  created_at={blog.created_at}
                  short_description={blog.content.slice(0, 120) + "..."}
                />
              </BlurFade>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
