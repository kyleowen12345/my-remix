/* eslint-disable import/no-unresolved */
import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { globalHttpHeaders } from "~/constants/apiEndPointHeaders";
import { getCookie } from "~/utils/cookies.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const articleId = params.articleId;

  if (!articleId) {
    throw new Response("Article ID is required", { status: 400 });
  }

  const apiUrl = process.env.STRAPI_API_URL;
  if (!apiUrl) {
    throw new Response("STRAPI_API_URL is not defined", { status: 500 });
  }
  const token = getCookie(request, "token");
  const response = await fetch(`${apiUrl}/deletearticle/${articleId}`, {
    method: "POST",
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
    console.error("Failed to delete article:", await response.text());
    throw new Response("Failed to delete article", { status: response.status });
  }

  return redirect("/");
};
