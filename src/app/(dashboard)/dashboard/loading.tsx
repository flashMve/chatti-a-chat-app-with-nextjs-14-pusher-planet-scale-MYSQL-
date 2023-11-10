import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

const loading: FC = ({}) => {
  return (
    <main className="flex items-start justify-start min-h-full p-8 flex-col w-full ">
      <Skeleton className="text-bold h-[3rem] w-72">
      </Skeleton>
      <Separator className="my-6" />

      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-x-5 border-[0.1px] rounded-md p-4 mt-5"
        >
          <div className="flex gap-x-5">
            <Skeleton className="rounded-full h-8 w-8"></Skeleton>

            <div className="flex flex-col">
              <Skeleton className="w-40 h-4" aria-hidden="true" />
              <Skeleton className="w-32 h-2 mt-2" aria-hidden="true" />
            </div>
          </div>
        </div>
      ))}
    </main>
  );
};

export default loading;
