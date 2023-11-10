"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { DeclineFriendValidator } from "@/lib/validators";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const DeclineFriendRequestButton: FC<z.infer<typeof DeclineFriendValidator>> = ({
  uid,
  requestId
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleDeclineFriendRequest = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/friends/decline", { uid, requestId });
      console.log(data);

      if (data.success) {
        toast.toast({
          title: "Friend Request Declined",
          description: "You have declined a friend request.",
          variant: "success"
        });
        router.refresh();
      }

    } catch (error) {
        if(error instanceof AxiosError){
          toast.toast({
            title: "Error",
            description: error.response?.data,
            variant: "destructive"
          });
        }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      aria-label="Cancel Friend Request"
      className="flex gap-x-4"
      variant={"destructive"}
      size={"lg"}
      disabled={loading}
      onClick={handleDeclineFriendRequest}
    >
      <span aria-hidden="true">Cancel</span>
      {loading ? (
        <Icons.spinner className="animate-spin h-5 w-5 text-green-500" />
      ) : (
        <Icons.cancel className="h-5 w-5 text-primary" />
      )}
    </Button>
  );
};

export default DeclineFriendRequestButton;
