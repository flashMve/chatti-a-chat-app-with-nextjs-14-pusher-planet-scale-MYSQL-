import prismaDb from "@/lib/db";
import getSession from "@/lib/getServerSession";
import { ChatURLContructor } from "@/helpers/chatURLConstructor";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";

interface FriendWithLastMessage {
  id: string;
  name: string;
  email: string;
  emailVerified: string;
  image: string;
  message: {
    content: string;
    senderId: string;
  };
}

interface ExtendedFriend {
  id: string;
  name: string;
  email: string;
  emailVerified: string;
  image: string;
}

const getFriendsWithLastMessage = async (uid: string) => {
  if (!uid) return;

  try {
    const chatUsers = await prismaDb.user.findFirst({
      where: {
        id: uid,
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

    // Make user and friend the same object

    const friends = [
      ...(chatUsers?.friends.map((user) => {
        return {
          ...user.user,
        };
      }) as []),
      ...(chatUsers?.user.map((user) => {
        return {
          ...user.friend,
        };
      }) as []),
    ] as ExtendedFriend[];

    // Get last message of each friend

    const friendsWithLastMessages = (await Promise.all(
      friends.map(async (friend) => {
        const lastMessage = await prismaDb.message.findFirst({
          where: {
            OR: [
              {
                chatId: ChatURLContructor(friend.id, uid),
              },
              {
                chatId: ChatURLContructor(uid, friend.id),
              },
            ],
          },
          select: {
            content: true,
            senderId: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          ...friend,
          message: lastMessage,
        };
      })
    )) as FriendWithLastMessage[];

    return friendsWithLastMessages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const page = async () => {
  const session = await getSession();


  if (!session) {
    return redirect("/login");
  }

  const {
    user: { id },
  } = session;
  const friendsWithLastMessage = (await getFriendsWithLastMessage(
    id
  )) as FriendWithLastMessage[];

  return (
    <main className="flex items-start justify-start min-h-full p-8 flex-col w-full ">
      <h1 className="text-bold text-5xl lg:text-5xl font-bold bg-gradient-to-r text-transparent bg-clip-text from-violet-500 to-pink-500 ">
        Recent Chats
      </h1>
      <Separator className="my-6" />

      {friendsWithLastMessage.length > 0 ? (
        friendsWithLastMessage.map((friend) => {
          return (
            <Link
              href={`/dashboard/chat/${ChatURLContructor(friend.id, id)}`}
              key={friend.id}
              className="flex w-full md:w-1/2 items-center gap-x-5 border-[0.1px] rounded-md border-gray-600 p-4 mb-4"
            >
              <div className="relative h-8 w-8">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  alt="Friends Online"
                  src={friend.image ?? ""}
                />
              </div>

              <div className="flex flex-col">
                <span aria-hidden="true">{friend.name ?? "Name"}</span>
                <span className="flex">
                <span className="text-sm text-gray-200 mr-2" aria-hidden="true">
                  {friend.message.senderId === id  ? "You: " : " "}
                </span>
                <span className="text-sm text-gray-400" aria-hidden="true">
                  {friend.message?.content ?? "No message"}
                </span>

                </span>
              </div>
            </Link>
          );
        })
      ) : (
        <h1 className="text-bold text-5xl lg:text-5xl font-bold bg-gradient-to-r text-transparent bg-clip-text from-violet-500 to-pink-500 ">
          No recent chats
        </h1>
      )}
    </main>
  );
};

export default page;
