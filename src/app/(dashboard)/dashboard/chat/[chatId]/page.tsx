import prismaDb from "@/lib/db";
import getSession from "@/lib/getServerSession";
import { Chat, Message } from "@/lib/message";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FC } from "react";
import Messages from "./_components/Messages";
import ChatInput from "./_components/ChatInput";
import { ChatURLContructor } from "@/helpers/chatURLConstructor";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

const getMessages = async (chatId: string) => {
  try {
    const messages = (await prismaDb.message.findMany({
      where: {
        chatId: chatId,
      },
      orderBy:{
        createdAt:'asc'
      }
    })) as Message[];


    if (!messages) return [];

    const reverse = messages.reverse() as Message[];

    return reverse;
  } catch (err) {
    console.log(err);
  }
};

const getOrCreateChat = async (userId1: string, userId2: string) => {
  'use server'
  
  try {
    // check if friend or not
    const friend = await prismaDb.friends.findFirst({
      where: {
       OR:[
          {
            userId:userId1,
            friendId:userId2
          },
          {
            userId:userId2,
            friendId:userId1
          }
       ]
      },
      
      select:{
        
        friend:true,
        user:true
      }
    });

    console.log(friend);

    if (!friend) return null;

    const chat = await prismaDb.chat.findFirst({
      where: {
        OR: [
          {
            sender: userId1,
            receiver: userId2,
          },
          {
            sender: userId2,
            receiver: userId1,
          },
        ],
      },
      select:{
        id:true,
        chatBelongsTo:true,
        chatBelongsToOther:true
      }
    });


    if (chat) return chat;

    const newChat = await prismaDb.chat.create({
      data: {
        id: ChatURLContructor(userId1, userId2),
        sender: userId1,
        receiver: userId2,
      },
    });

    return newChat;
  } catch (err) {
    console.log(err);
  }
};

const page: FC<ChatPageProps> = async ({ params }: ChatPageProps) => {
  
  const { chatId } = params;
  const session = await getSession();



  if (!session) notFound();

  const [userId1, userId2] = chatId.split("--");

  if (userId1 !== session.user.id && userId2 !== session.user.id) notFound();

  if (userId1 === userId2) notFound();


  const chatpartner = await prismaDb.user.findUnique({
    where: {
      id: userId1 === session.user.id ? userId2 : userId1,
    },
  });

  if (!chatpartner) notFound();

  const chat = await getOrCreateChat(userId1, userId2);


  if (!chat) notFound();

  const reverse = await getMessages(chat?.id ?? "");

  const messages = reverse;


  return (
    <div className="flex flex-1 justify-between flex-col h-full max-h-[calc(100vh-2rem)]">
      <div className="flex sm:items-center justify-between py-6 border-b-[0.1px] border-gray-700 px-8">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 h-8 sm:w-12 sm:h-12">
              <Image
                fill
                src={chatpartner?.image ?? ""}
                alt={chatpartner?.name ?? ""}
                className="rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-primary mr-3 font-semibold truncate">
                {chatpartner?.name}
              </span>
            </div>

            <span className="text-gray-400 text-sm truncate">
              {chatpartner?.email}
            </span>
          </div>
        </div>
      </div>
      <Messages
        initialMessages={messages ?? []}
        session={session}
        chatId={chat.id}
        chatPartner={chatpartner}
      />
      <ChatInput
        session={session}
        chatPartner={chatpartner}
        chatId={chat?.id ?? ""}
      />
    </div>
  );
};

export default page;
