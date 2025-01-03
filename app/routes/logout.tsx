/* eslint-disable import/no-unresolved */
// routes/logout.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { destroyCookie } from "~/utils/cookies.server";

export const action: ActionFunction = async () => {
  // Remove the token cookie
  return redirect("/login", {
    headers: {
      "Set-Cookie": destroyCookie("token"),
    },
  });
};

export default function LogoutPage() {
  return <p>Logging out...</p>;
}
