"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AcceptFriendValidator } from "@/lib/validators";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const AcceptFriendRequestButton: FC<z.infer<typeof AcceptFriendValidator>> = ({
  uid,
  requestId,
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleAcceptFriendRequest = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/friends/accept", {
        uid,
        requestId,
      });
      if (data.friendId) {
        toast.toast({
          title: "Friend Request Accepted",
          description: "You are now friends",
          variant: "success"
        });
      }
      router.refresh();
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
      aria-label="Accept Friend Request"
      className="flex gap-x-4"
      variant={"outline"}
      size={"lg"}
      disabled={loading}
      onClick={handleAcceptFriendRequest}
    >
      <span aria-hidden="true">Accept</span>
      {loading ? (
        <Icons.spinner className="animate-spin h-5 w-5 text-green-500" />
      ) : (
        <Icons.check className="h-5 w-5 text-green-500" />
      )}
    </Button>
  );
};

export default AcceptFriendRequestButton;
