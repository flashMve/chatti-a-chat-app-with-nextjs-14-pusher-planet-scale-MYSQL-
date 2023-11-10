import { FC } from "react";

const page: FC = async ({}) => {
  // CHAT NOT  FOUND ERROR 404 PAGE
  return (
    <div className="flex w-full flex-col items-center justify-center">

      <h1 className="text-bold text-6xl lg:text-5xl font-bold bg-gradient-to-r text-transparent bg-clip-text from-violet-500 to-pink-500">
        Chat Not Found 
      </h1>
    </div>
  );
};

export default page;
