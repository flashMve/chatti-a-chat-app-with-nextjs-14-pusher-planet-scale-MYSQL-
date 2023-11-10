import Image from "next/image";
import { FC } from "react";
import AcceptFriendRequestButton from "./AcceptFriendRequestButton";
import DeclineFriendRequestButton from "./DeclineFriendRequestButton";
import { FriendRequestItemProps } from "../page";

const FriendReqestItem: FC<FriendRequestItemProps> = ({
  from: { image, email, name, id },
  id: requestId,
  accepted,
}) => {
  return (
    <div className="flex items-center gap-x-5 border-[0.1px] rounded-md border-gray-600 p-4 mb-4">
      <div className="relative h-8 w-8">
        <Image
          fill
          referrerPolicy="no-referrer"
          className="rounded-full"
          alt="Friends Online"
          src={image ?? ""}
        />
      </div>

      <div className="flex flex-col">
        <span aria-hidden="true">{name}</span>
        <span className="text-xs text-gray-400" aria-hidden="true">
          {email}
        </span>
      </div>

      {/* Buttons */}

      <div className="flex gap-x-5">
       {requestId && <AcceptFriendRequestButton uid={id} requestId={requestId}/>}
       {requestId &&<DeclineFriendRequestButton uid={id} requestId={requestId} />}
      </div>
    </div>
  );
};

export default FriendReqestItem;
