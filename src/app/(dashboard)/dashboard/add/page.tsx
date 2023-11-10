import { FC } from "react";
import AddFriendsButton from "./_components/AddFriendsButton";

interface pageProps {}

const page: FC<pageProps> = ({}) => {


  return (
    <main className="flex items-center justify-center min-h-full flex-col w-full">
      <h1 className="text-bold text-5xl -rotate-3 mb-16 font-bold bg-gradient-to-r text-transparent bg-clip-text from-violet-500 to-pink-500 ">
        Add a Friend
      </h1>
      <AddFriendsButton />
    </main>
  );
};

export default page;
