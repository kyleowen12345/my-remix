/* eslint-disable import/no-unresolved */

import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import { globalHttpHeaders } from "~/constants/apiEndPointHeaders";
import { CreateArticleSelectOptionsType } from "~/types/app";
import { Author } from "~/types/author";
import { Category } from "~/types/category";
import { getCookie } from "~/utils/cookies.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Create Article" },
    { name: "description", content: "Create your new article" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const slug = formData.get("slug")?.toString();
  const authorId = formData.get("authorId")?.toString();
  const categoryId = formData.get("categoryId")?.toString();

  // Check for required fields
  if (!title || !description || !slug || !authorId || !categoryId) {
    throw new Response("Missing required fields", { status: 400 });
  }

  const token = getCookie(request, "token");

  const apiUrl = process.env.STRAPI_API_URL;
  if (!apiUrl) {
    throw new Response("STRAPI_API_URL is not defined", { status: 500 });
  }

  const response = await fetch(`${apiUrl}/createarticle`, {
    method: "POST",
    headers: {
      ...globalHttpHeaders,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
      slug,
      authorId,
      categoryId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to create article:", errorText);
    throw new Response("Failed to create article", { status: response.status });
  }

  const articleData = await response.json();
  return redirect(`/article/${articleData.id}`);
};

export const loader = async () => {
  // Fetch both authors and categories concurrently using Promise.all
  const [authorsResponse, categoriesResponse] = await Promise.all([
    fetch(`${process.env.STRAPI_API_URL}/authors`),
    fetch(`${process.env.STRAPI_API_URL}/categories`),
  ]);

  // Check if both requests were successful
  if (!authorsResponse.ok || !categoriesResponse.ok) {
    throw new Error("Failed to fetch data from Strapi");
  }

  // Parse the responses as JSON
  const authorsData = await authorsResponse.json();
  const categoriesData = await categoriesResponse.json();

  // Return the combined data
  return json({
    authors: authorsData?.data,
    categories: categoriesData?.data,
  });
};

export default function CreateArticle() {
  const data = useLoaderData<CreateArticleSelectOptionsType>();
  return (
    <div className="container my-12 mx-auto px-4  md:px-12">
      <h1 className="text-2xl font-bold mb-4">Create a New Article</h1>

      <Form method="post">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-semibold">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-semibold">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="authorId" className="block text-sm font-semibold">
            Author
          </label>
          <select
            id="authorId"
            name="authorId"
            required
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="">Select an author</option>
            {/* Populate author options dynamically */}
            {data?.authors?.map((i: Author) => (
              <option key={i?.id} value={i?.id}>
                {i?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="categoryId" className="block text-sm font-semibold">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="">Select a category</option>
            {/* Populate category options dynamically */}
            {data?.categories?.map((i: Category) => (
              <option key={i?.id} value={i?.id}>
                {i?.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Article
        </button>
      </Form>
    </div>
  );
}
