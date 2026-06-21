"use client";

import Image from "next/image";
import { CalendarDays, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

interface BlogCardProps {
  id: string;
  // slug: string,
  title: string;
  short_description: string;
  image_url: string;
  author: string;
  created_at: string;
}

const BlogCard = ({
  id,
  title,
  short_description,
  image_url,
  author,
  created_at,
}: BlogCardProps) => {
  const router = useRouter();

  const { isAuthenticate } = useAuthStore();

  const handleReadBlog = () => {
    console.log("Clicked Blog ID:", id);

    if (!isAuthenticate) {
      router.push(`/login?redirect=/blog/${id}`);
      return;
    }

    router.push(`/blog/${id}`);
  };

  return (
    <article
      onClick={handleReadBlog}
      className="group cursor-pointer overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Blog Image */}

      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image_url}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}

      <div className="space-y-4 p-5">
        <h2 className="line-clamp-2 text-xl font-semibold">{title}</h2>

        <p className="line-clamp-3 text-sm text-muted-foreground">
          {short_description}
        </p>

        {/* Footer */}

        <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{author}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            <span>{new Date(created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
