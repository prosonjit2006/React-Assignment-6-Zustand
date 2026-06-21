"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import DyanmicInput from "@/components/DyanmicInput";
import { useBlogStore } from "@/store/useBlogStore";
import { Blog, BlogPayload } from "@/types/interface/blog.interface";
import { blogSchema } from "@/services/validation/blog.validation";
import { bloginputField } from "@/services/json/blog.input";
import { ShimmerButton } from "@/components/ui/shimmer-button";
const Blogs = () => {
  const {
    imagePreview,
    setImagePreview,
    closeImagePreview,

    dialog,
    setDialog,
    closeDialog,

    isBlogs,
    setBlog,
    clearBlog,
    nextPage,
    prevPage,
    page,
    limit,
    setLimit,
    totalBlogs,

    adminBlogs,
    isLoading,

    getAdminBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
    blogStatusChange,
  } = useBlogStore();

  const totalPages = Math.ceil(totalBlogs / limit);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // console.log("Blogs", adminBlogs);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<BlogPayload>({
    resolver: yupResolver(blogSchema),
    defaultValues: {
      title: "",
      author: "",
      content: "",
      image: null,
      category: "",
    },
  });

  useEffect(() => {
    getAdminBlogs({
      page,
      limit,
    });
  }, [page, limit, getAdminBlogs]);

  const onSubmit = async (data: BlogPayload) => {
    // console.log('data on submit', data)

    let res;

    if (isBlogs) {
      res = await updateBlog({
        id: isBlogs.id!,
        payload: data,
      });
    } else {
      res = await addBlog(data);
    }

    if (res.success) {
      reset({
        title: "",
        author: "",
        content: "",
        category: "",
        image: null,
      });

      clearBlog();
      closeImagePreview();
      closeDialog();
    }
  };
  const handleEdit = (blog: Blog) => {
    setBlog(blog);

    setValue("title", blog.title);
    setValue("content", blog.content || "");
    setValue("author", blog.author || "");
    setValue("category", blog.category || "");

    if (blog.image) {
      setImagePreview(blog.image);
    }

    setDialog(true);
  };

  const handleCloseDialog = () => {
    reset({
      title: "",
      author: "",
      content: "",
      category: "",
      image: null,
    });

    clearBlog();
    closeImagePreview();
    closeDialog();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Blogs</h3>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>

        <ShimmerButton
          className="py-1 px-3"
          onClick={() => {
            clearBlog();

            reset({
              title: "",
              author: "",
              content: "",
              category: "",
              image: null,
            });

            closeImagePreview();

            setDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Blog
        </ShimmerButton>
      </div>

      {/* Dialog Part */}
      <Dialog
        open={dialog}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDialog();
          } else {
            setDialog(true);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{isBlogs ? "Update Blog" : "Create Blog"}</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {bloginputField.map((input, index) => (
              <DyanmicInput
                key={index}
                name={input.name}
                type={input.type}
                label={input.label}
                isTextarea={input.isTextArea}
                register={register}
                error={errors[input.name as keyof BlogPayload]?.message}
              />
            ))}

            {/* Image Upload */}
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative w-32 h-32">
                  <Image
                    src={imagePreview}
                    alt="preview"
                    width={200}
                    height={200}
                    className="w-full h-full rounded-md border object-cover"
                  />

                  <button
                    type="button"
                    onClick={closeImagePreview}
                    className="absolute top-1 right-1 rounded bg-red-500 px-2 text-white"
                  >
                    x
                  </button>
                </div>
              )}

              <Button
                type="button"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image
              </Button>

              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setValue("image", file);
                  const imageUrl = URL.createObjectURL(file);
                  setImagePreview(imageUrl);
                }}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isBlogs
                ? "Update Blog"
                : isLoading
                  ? "Creating Blog..."
                  : "Create Blog"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Blog Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-40" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-12" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="ml-auto h-5 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : adminBlogs.length > 0 ? (
              adminBlogs.map((blog: any) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={60}
                        height={60}
                        unoptimized
                        className="h-14 w-14 rounded-md border object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-md border text-xs">
                        No Image
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell className="font-medium">{blog.author}</TableCell>
                  <TableCell className="font-medium">{blog.category}</TableCell>

                  <TableCell>
                    <Switch
                      checked={blog.published}
                      onCheckedChange={() =>
                        blogStatusChange({
                          id: blog.id!,
                          published: blog.published || false,
                        })
                      }
                    />
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(blog)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteBlog(blog.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  No Blogs Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table data pagination and blog count  */}
      <div className="mt-6 flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Page Size */}
        <select
          className="h-10 rounded-lg border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>

        {/* Pagination */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={page === 1}
            onClick={prevPage}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex h-10 min-w-10 items-center justify-center rounded-lg border bg-muted px-4 font-semibold">
            Page {page} of {totalPages || 1}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={page >= totalPages}
            onClick={nextPage}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
