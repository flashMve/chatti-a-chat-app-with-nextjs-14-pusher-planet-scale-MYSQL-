import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className="flex flex-col h-full items-center">
      <Skeleton className="mb-4 h-20 w-full" />
      {/* chat messages */}
      <div className="flex-1 max-h-full overflow-y-scroll w-full">
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  <div className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="relative h-10 w-10">
                        <Skeleton className="rounded-full w-[40px] h-[40px]" />
                      </div>
                      <div className="relative mr-3 text-sm text-black rounded-xl">
                        <Skeleton className="ml-2 w-[180px] h-[40px]" />
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="relative h-10 w-10">
                        <Skeleton className="rounded-full w-[40px] h-[40px]" />
                      </div>
                      <div className="relative mr-3 text-sm text-black rounded-xl">
                        <Skeleton className="ml-2 w-[180px] h-[40px]" />
                      </div>
                    </div>
                  </div>

                

                  {/* my messages */}
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="relative h-10 w-10">
                        <Skeleton className="rounded-full w-[40px] h-[40px]" />
                      </div>
                      <div className="relative mr-3 text-sm text-black rounded-xl">
                        <Skeleton className="ml-2 w-[180px] h-[40px]" />
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="relative h-10 w-10">
                        <Skeleton className="rounded-full w-[40px] h-[40px]" />
                      </div>
                      <div className="relative mr-3 text-sm text-black rounded-xl">
                        <Skeleton className="ml-2 w-[180px] h-[40px]" />
                      </div>
                    </div>
                  </div>
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="relative h-10 w-10">
                        <Skeleton className="rounded-full w-[40px] h-[40px]" />
                      </div>
                      <div className="relative mr-3 text-sm text-black rounded-xl">
                        <Skeleton className="ml-2 w-[180px] h-[40px]" />
                      </div>
                    </div>
                  </div>

                  <div className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="relative h-10 w-10">
                        <Skeleton className="rounded-full w-[40px] h-[40px]" />
                      </div>
                      <div className="relative mr-3 text-sm text-black rounded-xl">
                        <Skeleton className="ml-2 w-[180px] h-[40px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* chat input */}

      {/* <ChatInput
        chatPartner={chatPartner}
        img={session.user.image}
        chatId={chatId}
      /> */}
    </div>
  );
};

export default loading;
