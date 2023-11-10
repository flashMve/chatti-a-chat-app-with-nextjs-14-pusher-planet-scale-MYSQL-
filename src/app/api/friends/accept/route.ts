import prismaDb from "@/lib/db";
import getSession from "@/lib/getServerSession";
import { pusherServer } from "@/lib/pusher";
import { pusherSubscriptionKey } from "@/lib/utils";
import { AcceptFriendValidator } from "@/lib/validators";
import { User } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, requestId } = AcceptFriendValidator.parse(body);

    const session = await getSession();
    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const {
      user: { id: userId, email: userEmail, name },
    } = session;

    const friend: User | null = await prismaDb.user.findFirst({
      where: {
        id: uid,
      },
    });

    if (friend === null) {
      return new Response("User not found", { status: 404 });
    }

    if (friend.id === userId) {
      return new Response("You cannot add youself as a friend", {
        status: 400,
      });
    }

    // Valid friend request

    await Promise.all([
      prismaDb.friends.create({
        data: {
          friendId: friend.id,
          userId: userId,
        },
      }),
      prismaDb.user.update({
        where: {
          id: userId,
        },
        data: {
          incommingFriendRequests: {
            delete: {
              fromId_toId: {
                fromId: userId,
                toId: friend.id,
              },
            },
          },
        },
      }),
      pusherServer.trigger(
        pusherSubscriptionKey(`user-${friend.id}-friend-request-accepted`),
        pusherSubscriptionKey(`friend-request-accepted`),
        {
          message: `${name} accepted your friend request`,
          username: name,
          friend,
        }
      ),
    ]);

    // const addFriend = await prismaDb.friends.create({
    //   data: {
    //     friendId: friend.id,
    //     userId: userId,
    //   },
    // });

    // // connect friend

    // const deleteFriendRequest = await prismaDb.user.update({
    //   where: {
    //     id: userId,
    //   },
    //   data: {
    //     incommingFriendRequests: {
    //       delete: {
    //         fromId_toId: {
    //           fromId: userId,
    //           toId: friend.id,
    //         },
    //       },
    //     },
    //   },
    // });

    // pusherServer.trigger(
    //   pusherSubscriptionKey(`user-${friend.id}-friend-request-accepted`),
    //   pusherSubscriptionKey(`friend-request-accepted`),
    //   {
    //     message: `${name} accepted your friend request`,
    //     username: name,
    //     friend,
    //   }
    // );

    return new Response(
      JSON.stringify({
        friendId: friend.id,
        userId: userId,
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log(e);
    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
