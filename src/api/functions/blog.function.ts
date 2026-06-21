import { supabase } from "@/lib/supabsae.config";
import { BlogPayload } from "@/types/interface/blog.interface";

// ! fetch published public blogs
export const fetchPublishedBlogsFns = async () => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      message: "Published blogs fetched successfully",
      data,
    };
  } catch (error) {
    const err = error as { message: string };

    return {
      success: false,
      message: err.message || "Failed to fetch blogs",
    };
  }
};

// ! fetch single blog using id
export const fetchBlogByIdFns = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return {
      success: true,
      message: "Blog fetched successfully",
      data,
    };
  } catch (error) {
    const err = error as {
      message: string;
    };

    return {
      success: false,
      message: err.message,
      data: null,
    };
  }
};

// ! Fetch admin blogs (all)
export const fetchAdminBlogsFns = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("blogs")
      .select("*", {
        count: "exact",
      })
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (error) throw error;

    return {
      success: true,
      message: "Blogs fetched successfully",
      data,
      count,
    };
  } catch (error) {
    const err = error as {
      message: string;
    };

    return {
      success: false,
      message: err.message,
      data: [],
      count: 0,
    };
  }
};

// ! add blogs
export const addBlogFns = async (payload: BlogPayload) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("Current User:", user);

    let imageURL: string | null = null;

    if (payload.image) {
      const extension = payload.image.name.split(".").pop();

      const filename = `${crypto.randomUUID()}.${extension}`;
      console.log("Before _ Upload");

      const { error: imageUploadError } = await supabase.storage
        .from("blog-images")
        .upload(filename, payload.image);

      if (imageUploadError) throw imageUploadError;

      console.log("After Upload");

      console.log("Before Insert");

      const { data: image } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filename);

      imageURL = image.publicUrl;
    }

    const { data: blog, error: failedCreation } = await supabase
      .from("blogs")
      .insert({
        title: payload.title,
        content: payload.content,
        image: imageURL,
        author: payload.author,
        category: payload.category,
        auth_users_id: user?.id,
        published: false,
      })
      .select();

    if (failedCreation) throw failedCreation;

    return {
      success: true,
      message: "Blog created successfully",
      data: blog,
    };
  } catch (error) {
    const err = error as { message: string };

    return {
      success: false,
      message: err.message || "Blog creation failed",
    };
  }
};

// ! blog update
export const updateBlogFns = async ({
  id,
  payload,
}: {
  id: string;
  payload: BlogPayload;
}) => {
  try {
    let imageURL: string | null = null;

    if (payload.image) {
      const filename = `${crypto.randomUUID()}-${payload.image.name}`;

      const { error: imageUploadError } = await supabase.storage
        .from("blog-images")
        .upload(filename, payload.image);

      if (imageUploadError) throw imageUploadError;

      const { data: image } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filename);

      imageURL = image.publicUrl;
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title: payload.title,
        content: payload.content,
        author: payload.author,
        category: payload.category,
        ...(imageURL && {
          image: imageURL,
        }),
      })
      .eq("id", id)
      .select();

    console.log("UPDATE ERROR", error);

    if (error) throw error;

    return {
      success: true,
      message: "Blog Updated Successfully",
      data,
    };
  } catch (error) {
    const err = error as { message: string };

    return {
      success: false,
      message: err.message,
    };
  }
};

// ! blog status changed (publish/unpublish)
export const blogStatusChangeFns = async ({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) => {
  try {
    const { error } = await supabase
      .from("blogs")
      .update({
        published: !published,
      })
      .eq("id", id);

    if (error) throw error;

    return {
      success: true,
      message: "Blog status updated successfully",
    };
  } catch (error) {
    const err = error as { message: string };

    return {
      success: false,
      message: err.message || "Failed to update blog status",
    };
  }
};

// ! delete blogs
export const deleteBlogFns = async (id: string) => {
  try {
    const res = await supabase
      .from("blogs")
      .select("image")
      .eq("id", id)
      .single();

    if (res.error) throw res.error;

    if (res.data?.image) {
      const imageURL = res.data.image;

      const urlArray = imageURL.split("/");
      const fileName = urlArray[urlArray.length - 1];

      if (fileName) {
        const { error: fileDeleteError } = await supabase.storage
          .from("blog-images")
          .remove([fileName]);

        if (fileDeleteError) throw fileDeleteError;
      }
    }

    const { error: deleteError } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return {
      success: true,
      message: "Blog deleted successfully",
    };
  } catch (error) {
    const err = error as { message: string };

    return {
      success: false,
      message: err.message || "Blog deletion failed",
    };
  }
};


