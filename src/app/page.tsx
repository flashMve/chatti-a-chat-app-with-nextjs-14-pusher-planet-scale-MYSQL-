import getSession from "@/lib/getServerSession";

export default async function Home() {
  const session = await getSession();

  return <div className="text-lg">Hello {session?.user.email}</div>;
}
