import { Category } from "./category";

export type ArticleCover = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  url: string;
};
export type ArticleAuthorAvatar = {
  url: string;
};
export type ArticleAuthor = {
  id: number;
  documentId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  avatar: ArticleAuthorAvatar;
};

export type Article = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover: ArticleCover;
  author: ArticleAuthor;
  category: Category;
};
