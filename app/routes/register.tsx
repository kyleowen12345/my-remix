/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunction, MetaFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Register " },
    { name: "description", content: "Register to this" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const apiUrl = process.env.STRAPI_API_URL;

  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch(`${apiUrl}/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    return { error: "Registration failed. Please try again." };
  }

  const data = await response.json();

  // Save the JWT token in a cookie (for client-side usage)
  return redirect("/", {
    headers: {
      "Set-Cookie": `token=${data.jwt}; Path=/; HttpOnly`,
    },
  });
};

export default function RegisterPage() {
  const actionData = useActionData<any>();
  // Set the JWT token in localStorage when available
  useEffect(() => {
    if (actionData?.jwt) {
      localStorage.setItem("token", actionData.jwt);
      // Redirect to the home page or another protected route
      window.location.href = "/";
    }
  }, [actionData]);

  return (
    <div className="container my-12 mx-auto px-4 md:px-12 flex items-center justify-center ">
      <div className="w-full max-w-md p-8 rounded-md  flex flex-col gap-6 ">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {actionData?.error && (
          <p className="mb-4 text-red-500 text-center">{actionData.error}</p>
        )}

        <Form method="post" className="space-y-2 flex flex-col gap-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Register
          </button>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
