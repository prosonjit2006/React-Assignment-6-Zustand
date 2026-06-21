import {
  addBlogFns,
  blogStatusChangeFns,
  deleteBlogFns,
  fetchAdminBlogsFns,
  fetchBlogByIdFns,
  fetchPublishedBlogsFns,
  updateBlogFns,
} from "@/api/functions/blog.function";
import { BlogPayload, BlogState } from "@/types/interface/blog.interface";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useBlogStore = create<BlogState>()(
  devtools(
    persist(
      (set, get) => ({
        isLoading: false,
        isError: null,

        blogs: [],
        isBlogs: null,
        adminBlogs: [],
        totalBlogs: 0,

        dialog: false,
        imagePreview: null,
        page: 1,
        limit: 5,

        setBlog: (blog: any) => {
          set({
            isBlogs: blog,
          });
        },

        clearBlog: () => {
          set({
            isBlogs: null,
          });
        },

        nextPage: () => {
          const { page, totalBlogs, limit } = get();

          const totalPages = Math.ceil(totalBlogs / limit);

          if (page < totalPages) {
            set({
              page: page + 1,
            });
          }
        },

        prevPage: () => {
          const { page } = get();

          if (page > 1) {
            set({
              page: page - 1,
            });
          }
        },

        setLimit: (payload) => {
          set({
            limit: payload,
            page: 1,
          });
        },

        setImagePreview: (payload: string) => {
          set({
            imagePreview: payload,
          });
        },

        closeImagePreview: () => {
          set({
            imagePreview: null,
          });
        },

        setDialog: (open: boolean) => {
          set({
            dialog: open,
          });
        },

        closeDialog: () => {
          set({
            dialog: false,
            imagePreview: null,
          });
        },

        selectedBlog: null,

        setSelectedBlog: (blog: any) => {
          set({
            selectedBlog: blog,
          });
        },

        // ! public bolgs fetching
        fetchBlogs: async () => {
          set({
            isLoading: true,
            isError: null,
          });

          try {
            const res = await fetchPublishedBlogsFns();

            set({
              blogs: res.data || [],
              isLoading: false,
            });

            return res;
          } catch (error) {
            const err = error as {
              message: string;
            };

            set({
              isError: err.message,
              isLoading: false,
            });

            return {
              success: false,
              message: err.message,
              data: [],
            };
          }
        },

        // ! fetch single bolgs by id
        fetchBlogById: async (id: string) => {
          set({
            isLoading: true,
            isError: null,
          });

          try {
            const res = await fetchBlogByIdFns(id);

            set({
              selectedBlog: res.data ?? null,
              isLoading: false,
            });

            return res;
          } catch (error) {
            const err = error as {
              message: string;
            };

            set({
              isLoading: false,
              isError: err.message,
            });

            return {
              success: false,
              message: err.message,
            };
          }
        },

        // ! fetch admin blogs (all)
        getAdminBlogs: async ({
          page,
          limit,
        }: {
          page: number;
          limit: number;
        }) => {
          set({
            isLoading: true,
            isError: null,
          });

          try {
            const res = await fetchAdminBlogsFns({
              page,
              limit,
            });

            set({
              isLoading: false,
              isError: null,
              adminBlogs: res.data || [],
              totalBlogs: res.count || 0,
            });

            return res;
          } catch (error) {
            const err = error as { message: string };

            set({
              isLoading: false,
              isError: err.message,
            });

            return {
              success: false,
              message: err.message,
              data: [],
            };
          } finally {
            set({
              isLoading: false,
            });
          }
        },

        // ! add blogs
        addBlog: async (payload: BlogPayload) => {
          set({
            isLoading: true,
            isError: null,
          });

          try {
            const res = await addBlogFns(payload);

            const blogsRes = await get().getAdminBlogs({
              page: 1,
              limit: 10,
            });

            set({
              adminBlogs: blogsRes.data || [],
            });

            return res;
          } catch (error) {
            const err = error as { message: string };

            set({
              isLoading: false,
              isError: err.message,
            });

            return {
              success: false,
              message: err.message,
            };
          } finally {
            set({
              isLoading: false,
            });
          }
        },

        // ! update blogs
        updateBlog: async ({
          id,
          payload,
        }: {
          id: string;
          payload: BlogPayload;
        }) => {
          set({
            isLoading: true,
            isError: null,
          });

          try {
            const res = await updateBlogFns({
              id,
              payload,
            });

            const blogsRes = await get().getAdminBlogs({
              page: get().page,
              limit: get().limit,
            });

            set({
              adminBlogs: blogsRes.data || [],
            });

            return res;
          } catch (error) {
            const err = error as { message: string };

            return {
              success: false,
              message: err.message,
            };
          } finally {
            set({
              isLoading: false,
            });
          }
        },

        // ! blogs status change
        blogStatusChange: async ({
          id,
          published,
        }: {
          id: string;
          published: boolean;
        }) => {
          try {
            const res = await blogStatusChangeFns({
              id,
              published,
            });

            const blogsRes = await get().getAdminBlogs({
              page: 1,
              limit: 10,
            });

            set({
              adminBlogs: blogsRes.data || [],
            });

            return res;
          } catch (error) {
            const err = error as { message: string };

            return {
              success: false,
              message: err.message,
            };
          }
        },

        // ! delete blog
        deleteBlog: async (id: string) => {
          set({
            // isLoading: true,
            isError: null,
          });

          try {
            const res = await deleteBlogFns(id);

            const blogsRes = await get().getAdminBlogs({
              page: 1,
              limit: 10,
            });

            set({
              adminBlogs: blogsRes.data || [],
            });

            return res;
          } catch (error) {
            const err = error as { message: string };

            set({
              isError: err.message,
            });

            return {
              success: false,
              message: err.message,
            };
          } finally {
            set({
              isLoading: false,
            });
          }
        },
      }),
      {
        name: "blog-storage",
      },
    ),
    {
      name: "Blog Store",
    },
  ),
);
