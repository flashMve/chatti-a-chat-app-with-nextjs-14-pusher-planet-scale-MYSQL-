import type { Metadata } from "next";
import SideBar from "./_components/SideBar";
import MobileSideBar from "./_components/MobileSideBar";

export const metadata: Metadata = {
  title: "Chatti Dashboard",
  description: "Chat App built with Next.js, Planetscale and Pusher",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex h-screen">
      <div className="md:hidden">
        <MobileSideBar >
          <SideBar classname="border-none" isMobile={true} />
        </MobileSideBar>
      </div>

      <SideBar classname="hidden md:flex" />

      <aside className="max-h-screen w-full max-sm:pt-[4.5rem]">{children}</aside>
    </div>
  );
}
