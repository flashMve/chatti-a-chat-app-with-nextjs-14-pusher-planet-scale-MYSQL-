'use client';

import { pusherClient } from "@/lib/pusher";
import { pusherSubscriptionKey } from "@/lib/utils";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { WrapWithSheetClose } from "./SideBar";

interface FriendRequestOptionProps {
  unSeenRequests: number;
  sessionId: string | undefined;
  option: SideBarProps;
  isMobile: boolean;
}

interface SideBarProps {
  id: number;
  name: string;
  href: string;
  icon: React.ReactNode;
}

const FriendRequestOption: FC<FriendRequestOptionProps> = ({
  option,
  sessionId,
  unSeenRequests,
  isMobile
}) => {

  const [unSeenRequestsCount, setUnSeenRequestsCount] = useState(unSeenRequests);

  useEffect(() => {
    pusherClient.subscribe(pusherSubscriptionKey(`incomming-friend-request--${sessionId}`))


    const friendRequestHandler = () => {
      setUnSeenRequestsCount((prev) => prev + 1)
    }

    pusherClient.subscribe(
      pusherSubscriptionKey(`user-${sessionId}-friend-request-accepted`)
    );

    const onFriendRequestAcceptedHandler = (data: any) => {
      setUnSeenRequestsCount((prev) => prev - 1)
    };

    pusherClient.bind(pusherSubscriptionKey("incomming-friend-request"), friendRequestHandler)

    pusherClient.bind(
      pusherSubscriptionKey(`friend-request-accepted`),
      onFriendRequestAcceptedHandler
    );

    return () => {
      pusherClient.unsubscribe(pusherSubscriptionKey(`incomming-friend-request--${sessionId}`))
      pusherClient.unbind("incomming-friend-request",friendRequestHandler)

    }
  },[sessionId])
  

  return (
    <WrapWithSheetClose isMobile={isMobile!}>

    <Link
      href={option.href}
      className="text-gray-300  hover:bg-gray-700 group flex gap-3 rounded-sm p-2 text-sm leading-6 font-semibold"
    >
      <span className="text-gray-400 border-gray-200  flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium">
        {option.icon}
      </span>
      <span className="truncate ">{option.name}</span>
      {unSeenRequestsCount > 0 ? (
        <span className="rounded-full bg-indigo-600 text-primary text-xs flex items-center w-5 h-5 justify-center">
          {unSeenRequestsCount}
        </span>
      ) : null}
    </Link>
    </WrapWithSheetClose>
  );
};

export default FriendRequestOption;
