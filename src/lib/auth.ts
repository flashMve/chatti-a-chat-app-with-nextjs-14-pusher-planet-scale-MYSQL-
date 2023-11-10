import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prismaDb from "@/lib/db";


const getGoogleSecret = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
    if (clientId && clientId.length == 0) {
      throw new Error("GOOGLE_CLIENT_ID is not set");
    }
  
    if (clientSecret && clientSecret.length == 0) {
      throw new Error("GOOGLE_CLIENT_SECRET is not set");
    }
  
    return {
      clientId,
      clientSecret,
    };
  };
  
const authOptions:AuthOptions = {
    adapter: PrismaAdapter(prismaDb),
    providers: [
      GoogleProvider({
        clientId: getGoogleSecret().clientId as string,
        clientSecret: getGoogleSecret().clientSecret as string,
      }),
    ],
    callbacks:{
      jwt({token, user, account, profile}) {
        return {
          token,
          id: user?.id,
        }
      },
      session(params) {
        return {
          expires: params.session.expires,
          user: {
            ...params.session.user,
            id: params.user.id,
          },
        }
      },
    },
    pages:{
      signIn: '/login'
    }
  };

export default authOptions;