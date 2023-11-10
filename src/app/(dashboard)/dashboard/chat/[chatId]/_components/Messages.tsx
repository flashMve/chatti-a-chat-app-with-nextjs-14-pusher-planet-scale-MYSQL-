"use client";
import { Message } from "@/lib/message";
import { cn, pusherSubscriptionKey } from "@/lib/utils";
import { User } from "@prisma/client";
import { Session } from "next-auth";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { pusherClient } from "@/lib/pusher";

interface MessagesProps {
  initialMessages: Message[];
  session: Session | null;
  chatPartner: User | null;
  chatId: string;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  session,
  chatId,
  chatPartner,
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const userId = session?.user?.id;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimeStamp = (timeStamp: number) => {
    return format(timeStamp, "hh:mm a");
  };

  useEffect(() => {
    pusherClient.subscribe(pusherSubscriptionKey(`private-chat-${chatId}`));

    const onMessageHandler = (data: Message) => {
      setMessages((messages) => [ data,...messages]);
    };

    pusherClient.bind(
      pusherSubscriptionKey(`private-new-message`),
      onMessageHandler
    );

    return () => {
      pusherClient.unsubscribe(pusherSubscriptionKey(`private-chat-${chatId}`));
      pusherClient.unbind(
        pusherSubscriptionKey(`new-message`),
        onMessageHandler
      );
    };
  }, [chatId]);

  return (
    <div
      id="messages"
      className="px-8 flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-xl font-semibold text-transparent bg-gradient-to-bl from-pink-500 to-violet-500 bg-clip-text">
            No messages yet start chatting
          </span>
        </div>
      
      )}
      {messages?.map((message, index) => {
        const isCurrentUser = message.senderId === userId;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === message.senderId;

        return (
          <div
            key={index}
            className={cn("flex items-end", {
              "justify-end": isCurrentUser,
            })}
          >
            <div
              className={cn("flex flex-col space-y-2 text-base max-w-xs mx-2", {
                "order-1 items-end": isCurrentUser,
                "order-2 items-start": !isCurrentUser,
              })}
            >
              <span
                className={cn("px-4 py-2 rounded-lg inline-block", {
                  "rounded-br-none":
                    !hasNextMessageFromSameUser && isCurrentUser,
                  "rounded-bl-none":
                    !hasNextMessageFromSameUser && !isCurrentUser,
                  "bg-indigo-600 text-primary": isCurrentUser,
                  "bg-gray-600 text-primary": !isCurrentUser,
                })}
              >
                {message.content}{" "}
                <span className="ml-2 text-xs text-gray-200">
                  {formatTimeStamp(Date.parse(message?.createdAt.toString()))}
                </span>
              </span>
            </div>
            <div
              className={cn("relative w-6 h-6", {
                "order-2": isCurrentUser,
                "order-1": !isCurrentUser,
                invisible: hasNextMessageFromSameUser,
              })}
            >
              <Image
                fill
                src={isCurrentUser ? userImage ?? "" : chatPartner?.image ?? ""}
                alt={isCurrentUser ? userName ?? "" : chatPartner?.name ?? ""}
                className="w-6 h-6 rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
