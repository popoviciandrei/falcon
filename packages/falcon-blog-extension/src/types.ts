import { Pagination } from '@deity/falcon-data';

export type BlogPostList = {
  items: BlogPost[];
  pagination?: Pagination;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  date: string;
  modified?: string;
  content: string;
  excerpt: string;
  status?: string;
  image?: BlogPostImage;
  related?: BlogPostList;
};

export type BlogPostImage = {
  url: string;
  description?: string;
};
