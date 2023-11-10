"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { Icons } from "@/components/icons";

interface GoogleButtonProps {}

const GoogleButton: FC<GoogleButtonProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } catch (e) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleGoogleSignIn} variant={"default"} size={"lg"}>
      {loading ? (
        <Icons.spinner className="animate-spin mr-3 h-5 w-5 text-white" />
      ) : (
        <Icons.google className="mr-3 h-5 w-5 text-white" />
      )}
      Sign in with Google
    </Button>
  );
};

export default GoogleButton;
