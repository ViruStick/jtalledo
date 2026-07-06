import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  let user;
  try {
    user = verifyToken(token);
  } catch {
    redirect("/");
  }

  return <DashboardClient user={user} />;
}
