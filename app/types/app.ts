import { Article } from "./article";
import { Author } from "./author";
import { Category } from "./category";

export interface CreateArticleSelectOptionsType {
  authors: Author[];
  categories: Category[];
}

export interface ArticleUpdateDefaultValue
  extends CreateArticleSelectOptionsType {
  article: Article;
}
