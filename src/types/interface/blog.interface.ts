export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  image: string | null;
  auth_users_id: string;
  published: boolean;
  created_at: string;
  category: string;
}

export interface BlogState {
  isLoading: boolean;
  isError: string | null;
  selectedBlog: Blog | null;
  blogs: Blog[];
  isBlogs: Blog | null;
  adminBlogs: Blog[];
  totalBlogs: number;

  imagePreview: string | null;
  dialog: boolean;

  page: number;
  limit: number;

  nextPage: () => void;
  prevPage: () => void;
  setLimit: (payload: number) => void;

  setImagePreview: (payload: string) => void;
  closeImagePreview: () => void;

  setDialog: (open: boolean) => void;
  closeDialog: () => void;

  fetchBlogs: () => Promise<any>;
  fetchBlogById: (id: string) => Promise<any>;
  setSelectedBlog: (blog: Blog | null) => void;
  getAdminBlogs: (payload: { page: number; limit: number }) => Promise<any>;
  addBlog: (payload: BlogPayload) => Promise<any>;

  updateBlog: (payload: { id: string; payload: BlogPayload }) => Promise<any>;

  blogStatusChange: (payload: {
    id: string;
    published: boolean;
  }) => Promise<any>;

  deleteBlog: (id: string) => Promise<any>;
  setBlog: (blog: Blog | null) => void;
  clearBlog: () => void;
}
export interface BlogPayload {
  title: string;
  content: string;
  image: File | null;
  author: string;
  category: string;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data?: Blog[];
}
