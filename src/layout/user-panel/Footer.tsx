import Link from "next/link";
import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand Section */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <BookOpen size={22} />
              <h2 className="text-xl font-bold">BlogHub</h2>
            </div>

            <p className="max-w-sm text-sm text-muted-foreground">
              Discover insightful articles, tutorials, and stories from
              passionate writers around the world.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-semibold">Navigation</h3>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Blogs
              </Link>

              <Link href="/login" className="hover:text-foreground">
                Login
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-semibold">Categories</h3>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Technology</span>
              <span>Programming</span>
              <span>Web Development</span>
              <span>Artificial Intelligence</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} BlogHub. All rights reserved.</p>

          <p>Built with Next.js, Zustand & Supabase</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
