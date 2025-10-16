// app/page.tsx
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  // check is user is authenticated
  // if user is type of pharma -> redirect to /Pharma
  // if user is type of company -> redirect to /company
  // else is not authenticated -> redirect to /auth/login
  const session = await getSession();
  // if (session?.user.userType === "pharma") {
  //   redirect("/pharma");
  // } else if (session?.user.userType === "company") {
  //   redirect("/company");
  // } else {
  //   redirect("/auth/login");
  // }

  if (session?.token) {
    redirect("/company");
  } else {
    redirect("/auth/login");
  }
}
