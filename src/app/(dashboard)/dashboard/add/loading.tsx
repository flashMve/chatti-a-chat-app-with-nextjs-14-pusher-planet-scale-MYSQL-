import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

const loading: FC = ({}) => {
  
  return (<main className="flex items-center justify-center min-h-full flex-col w-full">
    <h1 className="text-bold text-5xl -rotate-3 mb-16 font-bold bg-gradient-to-r text-transparent bg-clip-text from-violet-500 to-pink-500 ">
      <Skeleton className="h-12 w-72"/>
    </h1>
    <div className="flex flex-col items-start justify-center">
    <Skeleton className="h-2 w-8 mb-6"/>
    <Skeleton className="h-6 w-72 mb-6"/>
    </div>
    <Skeleton className="h-14 w-72"/>

  </main>);
};

export default loading;
