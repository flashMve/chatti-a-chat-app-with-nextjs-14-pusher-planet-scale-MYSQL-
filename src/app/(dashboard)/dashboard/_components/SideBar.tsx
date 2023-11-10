import { Icons } from "@/components/icons";
import getSession from "@/lib/getServerSession";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import FriendRequestOption from "./FriendRequestOption";
import prismaDb from "@/lib/db";
import SidebarChatList from "./SidebarChatList";
import { Friend } from "@/lib/message";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import LogoutButton from "./LogoutButton";

interface SideBarProps {
  id: number;
  name: string;
  href: string;
  icon: React.ReactNode;
}

const sideBarOptions: SideBarProps[] = [
  {
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    icon: <Icons.add className="h-5 w-5" />,
  },
  //   {
  //     id: 2,
  //     name: "Friend Requests",
  //     href: "/dashboard/requests",
  //     icon: <Icons.incoming className="h-5 w-5 " />,
  //   },
];

const getChats = async () => {
  try {
    const session = await getSession();

    if (!session) {
      return;
    }

    const {
      user: { id },
    } = session;

    const chatUsers = await prismaDb.user.findFirst({
      where: {
        id: session.user.id,
      },
      include: {
        friends: {
          include: {
            user: true,
          },
        },
        user: {
          include: {
            friend: true,
          },
        },
      },
    });

    const chats = [
      ...(chatUsers?.friends.map((user) => {
        return {
          friendId: user.friendId,
          userId: user.userId,
          friend: {
            ...user.user,
          },
        };
      }) as []),
      ...(chatUsers?.user.map((user) => {
        return {
          friendId: user.friendId,
          userId: user.userId,
          friend: {
            ...user.friend,
          },
        };
      }) as []),
    ] as Friend[];

    return chats;
  } catch (err) {
    console.log(err);
  }
};

type MainSideBarProps = {
  classname?: string;
  isMobile?: boolean;
};

export type WrapWithSheetCloseProps = {
  isMobile: boolean | false;
  children: React.ReactNode;
  className?: string;
};

export const WrapWithSheetClose: FC<WrapWithSheetCloseProps> = ({
  isMobile,
  children,
  className
}) => {
  return (
    <>
      {isMobile ? <SheetClose className={className} asChild>{children}</SheetClose> : <>{children}</>}
    </>
  );
};

const SideBar: FC<MainSideBarProps> = async ({ classname, isMobile }) => {
  const session = await getSession();

  const requests = await prismaDb.user.findFirst({
    where: {
      id: session?.user.id,
    },
    include: {
      incommingFriendRequests: true,
    },
  });

  const friends = (await getChats()) as Friend[];

  const unseenRequests = requests?.incommingFriendRequests.length;

  return (
    <div
      className={cn(
        "h-screen max-w-sm w-full flex grow flex-col gap-y-5 overflow-y-auto border-r-[0.2px] border-gray-600 px-6",
        classname
      )}
    >
      <WrapWithSheetClose className='hidden md:flex' isMobile={isMobile!}>
        <Link
          href="/dashboard"
          className="hidden md:flex shrink-0 h-16 w-16 items-center"
        >
          <Icons.logo className="h-8 w-auto text-indigo-600" />
        </Link>
      </WrapWithSheetClose>

      <   LogoutButton className='hidden max-sm:flex mt-2'/>



      <div className="text-xs font-semibold leading-6 text-gray-400">
        Your Chats
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <SidebarChatList
              isMobile={isMobile}
              friends={friends}
              userId={session?.user.id}
            />
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Overview
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {sideBarOptions.map((option) => {
                return (
                  <li key={option.id} className="transition-all">
                    <WrapWithSheetClose isMobile={isMobile!}>
                      <Link
                        href={option.href}
                        className="text-gray-300  hover:bg-gray-700 group flex gap-3 rounded-sm p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200  flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium">
                          {option.icon}
                        </span>
                        <span className="truncate ">{option.name}</span>
                      </Link>
                    </WrapWithSheetClose>
                  </li>
                );
              })}
              <li>
                  <FriendRequestOption
                    sessionId={session?.user.id}
                    unSeenRequests={unseenRequests ?? 0}
                    isMobile={isMobile!}
                    option={{
                      id: 2,
                      name: "Friend Requests",
                      href: "/dashboard/requests",
                      icon: <Icons.incoming className="h-5 w-5 " />,
                    }}
                  />
              </li>
            </ul>
          </li>

          <li className="-mx-6 mt-auto flex items-center">
            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 font-semibold leading-6 text-gray-300">
              <div className="relative h-8 w-8 shrink-0">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={session?.user?.image || ""}
                  alt="Profile Image"
                />
              </div>
              <span className="sr-only">Your Profile</span>
              <div className="flex flex-col">
                <span className="md:text-base text-sm" aria-hidden="true">
                  {session?.user.name}
                </span>
                <span className="text-xs text-gray-400" aria-hidden="true">
                  {session?.user.email}
                </span>
              </div>
            </div>

<   LogoutButton className='hidden md:flex'/>

          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
