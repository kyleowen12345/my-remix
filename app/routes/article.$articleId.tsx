/* eslint-disable import/no-unresolved */
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Article } from "~/types/article";
import { getCookie } from "~/utils/cookies.server";
import { globalHttpHeaders } from "~/constants/apiEndPointHeaders";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const token = getCookie(request, "token");
  const response = await fetch(
    `${process.env.STRAPI_API_URL}/findarticle/${params.articleId}`,
    {
      headers: {
        ...globalHttpHeaders,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data from Strapi");
  }
  const data = await response.json();
  return json(data);
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

export default function MyArticle() {
  const article = useLoaderData<Article>();

  return (
    <>
      <article className="container my-12 mx-auto px-4 md:px-12 flex flex-col gap-[40px]">
        <img
          src={
            article.cover?.url
              ? `http://localhost:1337${article.cover?.url}`
              : "https://cdn.pixabay.com/photo/2016/03/08/20/03/flag-1244649_1280.jpg"
          }
          alt={article?.title}
          className="block h-auto w-full max-h-[400px] object-cover	rounded-2xl	"
        />
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-col justify-between items-start gap-[10px] md:flex-row md:items-center">
            <h1 className="text-5xl">{article?.title}</h1>
            <div className="flex flex-row justify-between items-center gap-[10px]">
              <Form action="edit">
                <button
                  type="submit"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <i className="fas fa-edit text-xl"></i>
                </button>
              </Form>
              <Form
                action="destroy"
                method="post"
                onSubmit={(event) => {
                  if (
                    !confirm("Please confirm you want to delete this record.")
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <button
                  type="submit"
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-trash-alt text-xl"></i>
                </button>
              </Form>
            </div>
          </div>
          <div className="flex items-end no-underline hover:underline text-black">
            <img
              alt={article.author.name}
              className="w-7 h-7 rounded-full"
              src={`http://localhost:1337${article.author.avatar.url}`}
            />

            <p className="ml-2 text-md">{article.author.name}</p>
          </div>
          <div className="flex flex-col gap-[10px]">
            <p className="text-lg">{article?.description}</p>
          </div>
        </div>
      </article>
    </>
  );
}
