import prismaDb from "@/lib/db";
import getSession from "@/lib/getServerSession";
import { pusherServer } from "@/lib/pusher";
import { pusherSubscriptionKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validators";
import { User } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = addFriendValidator.parse(body);

    const session = await getSession();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user: User | null = await prismaDb.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return new Response("User not found", { status: 404 });
    }

    if (user.id === session.user.id) {
      return new Response("You cannot add youself as a friend", {
        status: 400,
      });
    }

    //   Check if user has already sent a friend request

    // check if user has already received a friend request

    const friendRequestFound = await prismaDb.user.findFirst({
      where: {
        id: session.user.id,
      },
      select: {
        outgoingFriendRequests: {
          where: {
            fromId: user.id,
          },
          include: {
            from: true,
          },
        },
      },
    });

    if (
      friendRequestFound === null ||
      friendRequestFound.outgoingFriendRequests.length > 0
    ) {
      return new Response("Friend request already sent", { status: 400 });
    }

    // check if user is already a friend

    const friendFound = await prismaDb.user.findFirst({
      where: {
        id: session.user.id,
      },
      select: {
        friends: {
          where: {
            friendId: session.user.id,
            userId: user.id,
          },
          include: {
            friend: true,
          },
        },
      },
    });


    if (friendFound && friendFound.friends.length > 0) {
      return new Response("User is already a friend", { status: 400 });
    }

    pusherServer.trigger(
      pusherSubscriptionKey(`incomming-friend-request--${user.id}`),
      pusherSubscriptionKey("incomming-friend-request"),
      {
        from:{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        },
        id: `${user.id}_${session.user.id}`,
        accepted: false,
      }
    );

    // Valid Request

    const requestSend = await prismaDb.user.update({
      where: {
        id: user.id,
      },
      data: {
        incommingFriendRequests: {
          create: {
            
            toId: session.user.id,
          },
        },
      },
      include: {
        incommingFriendRequests: true,
      },
    });


    if (!requestSend) {
      return new Response("Failed to send friend request", { status: 500 });
    }


    return new Response("Friend Request Sent Successfully", { status: 200 });
  } catch (err) {
    return new Response(`${err}`, { status: 500 });
  }
}
