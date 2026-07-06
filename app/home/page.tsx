import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  let user;
  try {
    user = verifyToken(token);
  } catch {
    redirect("/");
  }

  return <HomeClient user={user} />;
}
