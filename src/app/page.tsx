// app/page.tsx
import { redirect } from "next/navigation";

import { ROUTES_COMPANY } from "@/constants/routes";

export default async function Home() {
  redirect(ROUTES_COMPANY.DASHBOARD);
}
