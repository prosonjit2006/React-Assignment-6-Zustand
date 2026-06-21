import * as yup from "yup";

export const blogSchema = yup.object({
  title: yup.string().required("Title is Required"),
  content: yup.string().required("Content is Required"),
  category: yup.string().required("Category is Required"),
  author: yup.string().required("Author is Required"),
  image: yup.mixed<File>().nullable().defined(),
});
