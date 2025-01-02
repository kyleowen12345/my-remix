/* eslint-disable import/no-unresolved */
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Article } from "~/types/article";
import { formatDateToMMDDYYYY } from "~/helpers/stringDateFormatter";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const response = await fetch(
      `${process.env.STRAPI_API_URL}/articles/${params.articleId}?populate[cover]=true&populate[author][populate]=avatar`
    );

    if (!response.ok) {
      // Handle different types of errors
      if (response.status === 404) {
        throw new Error("Article not found");
      } else if (response.status === 500) {
        throw new Error("Internal server error");
      } else {
        throw new Error("Failed to fetch data from Strapi");
      }
    }

    const data = await response.json();
    if (!data?.data) {
      throw new Error("Data is missing");
    }

    return json(data?.data);
  } catch (error) {
    // Log the error to the console (or any monitoring service)
    console.error(error);

    // Return a generic error response to the user
    throw new Response("Something went wrong while fetching the article", {
      status: 500,
    });
  }
};

export const meta: MetaFunction = ({ data }) => {
  const articleData = data as Article; // Type assertion here

  const title = articleData?.title || "Default Article Title";
  const description = articleData?.description || "Default description";
  const image =
    articleData?.cover?.url || "https://example.com/default-cover.jpg";

  return [
    { title: title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
  ];
};

export default function Contact() {
  const article = useLoaderData<Article>();

  return (
    <>
      <article className="container my-12 mx-auto px-4 md:px-12 flex flex-col gap-[40px]">
        <img
          src={`http://localhost:1337${article.cover.url}`}
          alt={article?.title}
          className="block h-auto w-full max-h-[400px] object-cover	rounded-2xl	"
        />
        <div className="flex flex-col gap-[30px]">
          <h1 className="text-5xl">{article?.title}</h1>
          <div className="flex flex-col gap-[10px]">
            <p className="text-lg">{article?.description}</p>
            <p className="text-xs">
              {formatDateToMMDDYYYY(article?.publishedAt)}
            </p>
          </div>
          <div className="flex items-center no-underline hover:underline text-black">
            <img
              alt={article.author.name}
              className="w-10 h-10 rounded-full"
              src={`http://localhost:1337${article.author.avatar.url}`}
            />
            <p className="ml-2 text-sm">{article.author.name}</p>
          </div>
        </div>
      </article>
    </>
  );
}
