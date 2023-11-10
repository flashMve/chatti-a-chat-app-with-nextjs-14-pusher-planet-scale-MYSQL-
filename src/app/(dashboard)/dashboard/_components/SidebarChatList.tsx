"use client";

import { ChatURLContructor } from "@/helpers/chatURLConstructor";
import { Friend, Message } from "@/lib/message";
import { pusherClient } from "@/lib/pusher";
import { pusherSubscriptionKey } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { User } from "next-auth";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { WrapWithSheetClose } from "./SideBar";

interface SidebarChatListProps {
  friends: Friend[];
  userId: string | undefined;
  isMobile?: boolean | false;
}

interface ExtendedMessage extends Message {
  sender: User;
}

const SidebarChatList: FC<SidebarChatListProps> = ({
  friends,
  userId,
  isMobile,
}) => {
  

  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    pusherClient.subscribe(pusherSubscriptionKey(`user-${userId}-chats`));
    pusherClient.subscribe(
      pusherSubscriptionKey(`incomming-friend-request--${userId}`)
    );
    pusherClient.subscribe(
      pusherSubscriptionKey(`user-${userId}-friend-request-accepted`)
    );

    const onMessageHandler = (data: ExtendedMessage) => {
      if (data.senderId === userId) return;
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${ChatURLContructor(userId!, data.senderId)}`;

      if (!shouldNotify) return;
      if (data) {
        setUnseenMessages((messages) => [data, ...messages]);
        const id = toast.toast({
          className: "cursor-pointer",
          onClick: () => {
            router.push(
              `/dashboard/chat/${ChatURLContructor(userId!, data.senderId)}`
            );
            id.dismiss();
            setUnseenMessages((messages) =>
              messages.filter((message) => message.senderId !== data.senderId)
            );
          },
          title: data.sender?.name ?? "",
          action: (
            <>
              <Avatar>
                <AvatarImage
                  src={data.sender?.image ?? "https://github.com/shadcn.png"}
                  alt={data.sender?.name ?? "username"}
                />
              </Avatar>
            </>
          ),
          description: data.content,
          duration: 5000,
        });
      }
    };

    const onFriendRequestHandler = (data: any) => {
      router.refresh();
    };

    const onFriendRequestAcceptedHandler = (data: any) => {
      if (!data) return;

      const id = toast.toast({
        onClick: () => {
          router.push(
            `/dashboard/chat/${ChatURLContructor(userId!, data.friend.id)}`
          );
          id.dismiss();
        },
        title: `${data.message}`,
        description: `You can now chat with ${data.username}`,
        duration: 5000,
      });

      router.refresh();
    };

    pusherClient.bind(pusherSubscriptionKey(`new-message`), onMessageHandler);
    pusherClient.bind(
      pusherSubscriptionKey(`new-friend-request`),
      onFriendRequestHandler
    );
    pusherClient.bind(
      pusherSubscriptionKey(`friend-request-accepted`),
      onFriendRequestAcceptedHandler
    );

    return () => {
      pusherClient.unsubscribe(pusherSubscriptionKey(`user-${userId}-chats`));
      pusherClient.unsubscribe(
        pusherSubscriptionKey(`incomming-friend-request--${userId}`)
      );
      pusherClient.unsubscribe(
        pusherSubscriptionKey(`user-${userId}-friend-request-accepted`)
      );
      pusherClient.unbind(
        pusherSubscriptionKey(`new-message`),
        onMessageHandler
      );
      pusherClient.unbind(
        pusherSubscriptionKey(`new-friend-request`),
        onFriendRequestHandler
      );
      pusherClient.unbind(
        pusherSubscriptionKey(`friend-request-accepted`),
        onFriendRequestAcceptedHandler
      );
    };
  }, [pathname, userId, router, toast]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.map((friend) => {
        const unseenMessagesCount: number = unseenMessages.filter(
          (message) => message.senderId === friend.friend.id
        ).length;

        return (
          <li
              key={friend.friend.id}
              className="px-4 py-2  hover:bg-gray-700 rounded-md border"
            >
          <WrapWithSheetClose isMobile={isMobile!}>
              <Link
                prefetch={false}
                className="flex gap-3 items-center"
                href={`/dashboard/chat/${ChatURLContructor(
                  userId!,
                  friend.friend.id
                )}`}
                onClick={() => {
                  setUnseenMessages((messages) =>
                    messages.filter(
                      (message) => message.senderId !== friend.friend.id
                    )
                  );
                }}
              >
                <Image
                  src={friend.friend.image}
                  alt={friend.friend.name}
                  className="h-6 w-6 rounded-full"
                  width={32}
                  height={32}
                />
                <div className="flex-1 flex justify-between">
                  <div className="text-sm font-semibold leading-5">
                    {friend.friend.name}
                  </div>

                  {unseenMessagesCount > 0 && (
                    <Badge className="bg-indigo-500" variant={"secondary"}>
                      {unseenMessagesCount}
                    </Badge>
                  )}
                </div>
              </Link>
          </WrapWithSheetClose>
            </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
