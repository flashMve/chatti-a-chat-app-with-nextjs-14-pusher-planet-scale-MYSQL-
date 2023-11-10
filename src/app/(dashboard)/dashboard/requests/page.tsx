import { Separator } from "@/components/ui/separator";
import { FC, Suspense } from "react";
import FriendRequestList from "./_components/FriendRequestList";
import getSession from "@/lib/getServerSession";
import { redirect } from "next/navigation";
import LoadingFriendRequests from "./_components/LoadingFriendRequests";
import prismaDb from "@/lib/db";

interface pageProps {}

export interface FriendRequestItemProps {
  id: string;
  accepted: boolean;
  from: {
    id: string;
    image: string;
    email: string;
    name: string;
  };
  to: {
    id: string;
    image: string;
    email: string;
    name: string;
  };
}

export interface IncommingFriendRequestProps {
  accepted: boolean;
  toId: string;
  fromId: string;
  from: {
    id: string;
    image: string;
    email: string;
    name: string;
  };
  to: {
    id: string;
    image: string;
    email: string;
    name: string;
  };
}



const getFriendRequests = async (sessionId: string | null | undefined) => {
  const requests = await prismaDb.user.findFirst({
    where: {
      id: sessionId??"",
      incommingFriendRequests: {
        every: {
          accepted: false,
        },
      },
    },
    include: {
      incommingFriendRequests: {
        select: {
          toId: true,
          fromId: true,
          accepted: true,
          from:true,
          to:true
        },
      },
    },
  });

  const incomingRequests =
    requests?.incommingFriendRequests as IncommingFriendRequestProps[];

    console.log(incomingRequests)

  // const allUsers = await Promise.all(
  //   incomingRequests.map(async (req) => {
  //     const user = await prismaDb.user.findFirst({
  //       where: {
  //         id: req.toId,
  //       },
  //     });

  //     return {
  //       from: {
  //         ...user,
  //       },
  //       to:{},
  //       accepted: req.accepted,
  //       id: req.fromId +'_'+ req.toId,
  //     };
  //   })
  // );

  const allUsers = incomingRequests.map((req) => {
    return {
      from: {
        ...req.to,
      },
      to:{
        ...req.from
      },
      accepted: req.accepted,
      id: req.fromId +'_'+ req.toId,
    };
  })

  return allUsers;
};

const page: FC<pageProps> = async ({}) => {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const friendRequests = await getFriendRequests(session.user.id) as FriendRequestItemProps[];

  

  return (
    <main className="flex items-start justify-start min-h-full p-8 flex-col w-full ">
      <h1 className="text-bold text-5xl lg:text-5xl font-bold bg-gradient-to-r text-transparent bg-clip-text from-violet-500 to-pink-500 ">
        Friend Requests
      </h1>
      <Separator className="my-6" />
      {/* <Suspense fallback={<LoadingFriendRequests />}> */}
        <FriendRequestList
          sessionId={session.user.id}
          image={session.user.image}
          friendRequest={friendRequests}
        />
      {/* </Suspense> */}
    </main>
  );
};

export default page;
