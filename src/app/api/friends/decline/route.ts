import prismaDb from "@/lib/db";
import getSession from "@/lib/getServerSession";
import { DeclineFriendValidator } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, requestId } = DeclineFriendValidator.parse(body);

    const session = await getSession();
    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const {
      user: { id: userId },
    } = session;

    try {
      const deleteFriendRequest = await prismaDb.user.update({
        where: {
          id: userId,
        },
        data: {
          incommingFriendRequests: {
            delete: {
              fromId_toId: {
                fromId: userId,
                toId: uid,
              },
            },
          },
        },
      });
      if (deleteFriendRequest === null) {
        return new Response("Friend request not found", { status: 404 });
      }
      return new Response(
        JSON.stringify({
          message: "Friend request declined",
          success: true,
        }),
        {
          status: 200,
        }
      );
    } catch (e) {
      return new Response("Friend request not found", { status: 404 });
    }

  } catch (e) {
    console.log(e);
    return new Response("Something Went Wrong.", {
      status: 500,
    });
  }
}
