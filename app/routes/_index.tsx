/* eslint-disable import/no-unresolved */

import { json, LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { formatDateToMMDDYYYY } from "~/helpers/stringDateFormatter";
import { Article } from "~/types/article";

export const meta: MetaFunction = () => {
  return [
    { title: "Strapi with Remix baby" },
    { name: "description", content: "Welcome to Strapi and Remix!" },
  ];
};

export const loader: LoaderFunction = async () => {
  const response = await fetch(
    `${process.env.STRAPI_API_URL}/articles?populate[cover]=true&populate[author][populate]=avatar`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data from Strapi");
  }
  const data = await response.json();
  return json(data?.data);
};

export default function Index() {
  const data = useLoaderData<Article[]>();

  return (
    <div className="container my-12 mx-auto px-4 md:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((article: Article) => (
          <a
            href={`/article/${article.documentId}`}
            key={article.id}
            className="w-full"
          >
            <article className="overflow-hidden rounded-lg shadow-lg">
              {/* <a href="/"> */}
              <img
                alt={article.title}
                className="block h-auto w-full min-h-[250px]"
                src={`http://localhost:1337${article.cover.url}`}
              />
              {/* </a> */}

              <header className="flex items-start justify-between leading-tight p-2 md:p-4 min-h-[88px]">
                <h1 className="text-lg">
                  <p
                    className="no-underline hover:underline text-black line-clamp-2"
                    // href="/"
                  >
                    {article.title}
                  </p>
                </h1>
                <p className="text-grey-darker text-xs pt-2">
                  {formatDateToMMDDYYYY(article.publishedAt)}
                </p>
              </header>

              <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                <p
                  className="flex items-center no-underline hover:underline text-black"
                  // href="/"
                >
                  <img
                    alt={article.author.name}
                    className="w-10 h-10 rounded-full"
                    src={`http://localhost:1337${article.author.avatar.url}`}
                  />
                  <p className="ml-2 text-sm">{article.author.name}</p>
                </p>
                <p
                  className="no-underline text-grey-darker hover:text-red-dark"
                  // href="/"
                >
                  <span className="hidden">Like</span>
                  <i className="fa fa-heart"></i>
                </p>
              </footer>
            </article>
          </a>
        ))}
      </div>
    </div>
  );
}
