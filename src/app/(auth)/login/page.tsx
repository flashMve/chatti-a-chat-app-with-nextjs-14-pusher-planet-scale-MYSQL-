import React from "react";
import GoogleButton from "./_components/GoogleButton";
import getSession from "@/lib/getServerSession";
import { redirect } from "next/navigation";

const page = async () => {

  const session = await getSession();

  if (session) {
    return redirect("/");
  }


  return (
    <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center flex-col">
      <h1 className="text-9xl font-bold bg-gradient-to-tr from-violet-500 to-pink-500 text-transparent bg-clip-text mb-8">
        {" "}
        Chatti
      </h1>
     <GoogleButton/>
    </div>
  );
};

export default page;
