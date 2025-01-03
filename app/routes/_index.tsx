/* eslint-disable import/no-unresolved */

import { json, LoaderFunction, type MetaFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { globalHttpHeaders } from "~/constants/apiEndPointHeaders";
import { formatDateToMMDDYYYY } from "~/helpers/stringDateFormatter";
import { Article } from "~/types/article";
import { getCookie } from "~/utils/cookies.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Strapi with Remix baby" },
    { name: "description", content: "Welcome to Strapi and Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const apiUrl = process.env.STRAPI_API_URL;

  if (!apiUrl) {
    throw new Error("Environment variable STRAPI_API_URL is not set");
  }

  // Get the token from cookies
  const token = getCookie(request, "token");

  try {
    const response = await fetch(`${apiUrl}/findarticles`, {
      headers: {
        ...globalHttpHeaders,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Redirect to login page if Unauthorized (401)
      return redirect("/login");
    }

    if (!response.ok) {
      throw new Response("Failed to fetch data from Strapi", {
        status: response.status,
      });
    }

    const data = await response.json();

    // Ensure data is serializable to JSON to prevent hydration issues
    return json(data);
  } catch (error) {
    console.error("Error fetching data from Strapi:", error);
    throw new Response("An error occurred while fetching articles", {
      status: 500,
    });
  }
};

export default function Index() {
  const data = useLoaderData<Article[]>();

  return (
    <div className="container my-12 mx-auto px-4 md:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((article: Article) => (
          <a
            href={`/article/${article.id}`}
            key={article.id}
            className="w-full"
          >
            <article className="overflow-hidden rounded-lg shadow-lg">
              {/* <a href="/"> */}
              <img
                alt={article.title}
                className="block h-auto w-full min-h-[250px]"
                src={
                  article.cover?.url
                    ? `http://localhost:1337${article.cover?.url}`
                    : "https://cdn.pixabay.com/photo/2016/03/08/20/03/flag-1244649_1280.jpg"
                }
              />
              {/* </a> */}

              <header className="flex items-start justify-between leading-tight p-2 md:p-4 min-h-[40px] gap-10">
                <h1 className="text-lg">
                  <p
                    className="no-underline hover:underline text-black line-clamp-1"
                    // href="/"
                  >
                    {article.title}
                  </p>
                </h1>
                <p className="text-grey-darker text-xs pt-2">
                  {formatDateToMMDDYYYY(article.createdAt)}
                </p>
              </header>

              <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                <div
                  className="flex items-center no-underline hover:underline text-black"
                  // href="/"
                >
                  <img
                    alt={article.author.name}
                    className="w-10 h-10 rounded-full"
                    src={`http://localhost:1337${article.author.avatar.url}`}
                  />
                  <p className="ml-2 text-sm">{article.author.name}</p>
                </div>
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
