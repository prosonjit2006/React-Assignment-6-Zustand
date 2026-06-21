"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useBlogStore } from "@/store/useBlogStore";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const SingleBlogPage = () => {
  const { id } = useParams();

  const { selectedBlog, fetchBlogById, isLoading, isError } = useBlogStore();

  useEffect(() => {
    if (id) {
      fetchBlogById(id as string);
    }
  }, [id, fetchBlogById]);

  if (isLoading) {
    return <div className="container py-20 text-center">Loading Blog...</div>;
  }

  if (isError) {
    return (
      <div className="container py-20 text-center text-red-500">{isError}</div>
    );
  }

  if (!selectedBlog) {
    return <div className="container py-20 text-center">Blog Not Found</div>;
  }

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <Button>
          <ArrowLeft /> Back
        </Button>

        <div className="my-4">
          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm">
            {selectedBlog.category}
          </span>
        </div>

        <h1 className="mb-4 text-5xl font-bold">{selectedBlog.title}</h1>

        <div className="mb-10 flex gap-4 text-sm text-muted-foreground">
          <span>{selectedBlog.author}</span>

          <span>•</span>

          <span>{new Date(selectedBlog.created_at).toLocaleDateString()}</span>
        </div>

        <div className="relative mb-10 h-125 w-full overflow-hidden rounded-2xl">
          <Image
            src={selectedBlog.image}
            alt={selectedBlog.title}
            fill
            className="object-cover"
          />
        </div>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          {selectedBlog.content}
        </article>
      </div>
    </section>
  );
};

export default SingleBlogPage;
