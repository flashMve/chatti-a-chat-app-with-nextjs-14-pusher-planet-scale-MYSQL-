import prismaDb from "@/lib/db";
import getSession from "@/lib/getServerSession";
import { Message } from "@/lib/message";
import { pusherServer } from "@/lib/pusher";
import { pusherSubscriptionKey } from "@/lib/utils";
import { MessageValidator } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const session = await getSession();


    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { content, chatId, chatPartner } = await MessageValidator.parseAsync(
      body
    );


    const user = await prismaDb.user.findUnique({
      where: { id: session.user.id },
    });


    if (!user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const timestamp = new Date();

    const messageToSend: Message = {
      senderId: user.id,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: content,
      chatId: chatId,
      id: Math.floor(Math.random() * 1000000000).toString(),
    };

    pusherServer.trigger(
      pusherSubscriptionKey(`private-chat-${chatId}`),
      pusherSubscriptionKey(`private-new-message`),
      messageToSend
    );

    pusherServer.trigger(
      pusherSubscriptionKey(`user-${chatPartner.id}-chats`),
      pusherSubscriptionKey(`new-message`),
      {
        ...messageToSend,
        sender: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      }
    );

    const chat = await prismaDb.message.create({
      data: {
        type: "message",
        ...messageToSend,
      },
    });


    return new Response(JSON.stringify(chat), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Server Error", {
      status: 500,
    });
  }
}
