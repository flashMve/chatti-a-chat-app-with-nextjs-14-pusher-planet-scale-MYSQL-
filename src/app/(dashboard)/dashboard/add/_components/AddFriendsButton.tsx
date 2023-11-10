"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { Icons } from "@/components/icons";
import { addFriendValidator } from "@/lib/validators";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

type FormData = z.infer<typeof addFriendValidator>;

interface AddFriendsButtonProps {}

const AddFriendsButton: FC<AddFriendsButtonProps> = ({}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
    defaultValues: {
      email: "",
    },
  });

  const toast = useToast();

  const [loading, setloading] = useState<boolean>(false);

  const addFriend = async (data: FormData) => {
    setloading(true);
    try {
      const res = await axios.post("/api/friends/add", {
        email: data.email,
      });

      if (res.status == 200) {
        toast.toast({
          title: "Success",
          description: "Friend Request Sent",
          variant: "success",
          duration: 5000,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        form.setError("email", { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        form.setError("email", { message: error.response?.data });

        return;
      }

      form.setError("email", { message: "Something went wrong" });
    } finally {
      setloading(false);
    }
  };

  function onSubmit(values: FormData) {
    addFriend(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-8 w-full flex md:items-center flex-col">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="w-full md:w-80" placeholder="Enter Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} size={'lg'} className="w-full md:w-80">
          {loading && (
            <Icons.spinner className="animate-spin mr-2">🔄</Icons.spinner>
          )}
          Send Friend Request <span className="ml-2">
          &rarr;
            </span> 
        </Button>
      </form>
    </Form>
  );
};

export default AddFriendsButton;
