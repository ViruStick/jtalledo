import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  let user;
  try {
    user = verifyToken(token);
  } catch {
    redirect("/");
  }

  if (user.role !== "admin") redirect("/dashboard");

  return <AdminUsersClient />;
}
