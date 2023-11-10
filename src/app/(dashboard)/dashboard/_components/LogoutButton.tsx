"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { FC, useState } from "react";
import loading from "../loading";
import { useToast } from "@/components/ui/use-toast";

interface LogoutButtonProps {
  className: string;
}

const LogoutButton: FC<LogoutButtonProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const LogoutHandler = async () => {
    setLoading(true);
    try {

    await signOut({ redirect: true, callbackUrl: "/"});
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 5000,
        variant:"destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={LogoutHandler}
      variant={"ghost"}
      size={"icon"}
      disabled={loading}
      className={cn(
        "flex-shrink-0 h-8 w-8 text-gray-400 hover:bg-gray-600 mr-2",
        className
      )}
    >
      <Icons.logout />
      {loading && <Icons.spinner className="animate-spin mr-2"></Icons.spinner>}
    </Button>
  );
};

export default LogoutButton;
