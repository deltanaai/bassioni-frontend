// app/page.tsx
import { redirect } from "next/navigation";

import ROUTES from "@/constants/routes";

export default async function Home() {
  redirect(ROUTES.COMPANY_DASHBOARD);
}
