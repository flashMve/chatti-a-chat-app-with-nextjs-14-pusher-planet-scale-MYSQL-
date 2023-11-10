"use client";
import { FC, useEffect, useState } from "react";
import FriendReqestItem from "./FriendReqestItem";
import { FriendRequestItemProps } from "../page";
import { pusherClient } from "@/lib/pusher";
import { pusherSubscriptionKey } from "@/lib/utils";

interface FriendRequestListProps {
  sessionId: string | null | undefined;
  image: string | null | undefined;
  friendRequest: FriendRequestItemProps[];
}

const FriendRequestList: FC<FriendRequestListProps> = ({
  sessionId,
  image,
  friendRequest,
}) => {
  const [requests,setRquests] = useState<FriendRequestItemProps[]>(friendRequest);

  useEffect(() => {
    pusherClient.subscribe(pusherSubscriptionKey(`incomming-friend-request--${sessionId}`))
    const friendRequestHandler = (data: any) => {
      setRquests((prev) => [...prev, data])
    }

    pusherClient.bind(pusherSubscriptionKey("incomming-friend-request"), friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(pusherSubscriptionKey(`incomming-friend-request--${sessionId}`))
      pusherClient.unbind(pusherSubscriptionKey("incomming-friend-request"),friendRequestHandler)
    }
  },[sessionId])
  

  return (
    <div className="px-8 overflow-y-auto h-full">
      {requests?.length === 0 ? (
        <h1 className="text-center text-bold text-2xl  font-bold bg-gradient-to-r text-transparent bg-clip-text from-violet-500 to-pink-500 ">
          No Friend Requests
        </h1>
      ) : (
        requests?.map((request) => (
          <FriendReqestItem
            key={request.id}
            from={request.from}
            to={request.to ??{}}
            accepted={request.accepted}
            id={request.id}
          />
        ))
      )}
    </div>
  );
};

export default FriendRequestList;
