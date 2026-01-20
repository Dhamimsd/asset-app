import SideNav from "@/components/Navs/SideNav";
import TopNav from "@/components/Navs/TopNav";
import { connectDB } from "@/lib/database";
import { User } from "@/lib/model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await connectDB();

  const token = cookies().get("token")?.value;
  if (!token) redirect("/login");

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/login");
  }

  const userDoc = await User.findById(decoded.userId).lean();
  if (!userDoc) redirect("/login");

  const user = {
    _id: userDoc._id.toString(),
    email: userDoc.email,
    lastLogin: userDoc.lastLogin,
  };

  return (
    <section>
      <TopNav user={user} />
      <div className="flex min-h-screen">
        <SideNav />
        <div className="container w-full pt-4 pb-24 md:py-4 ">{children}</div>
      </div>
    </section>
  );
}
