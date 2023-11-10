import * as z from "zod";

export const addFriendValidator = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export const AcceptFriendValidator = z.object({
  uid: z.string(),
  requestId : z.string(),

});


export const DeclineFriendValidator = z.object({
  uid: z.string(),
  requestId : z.string(),
});

export const MessageValidator = z.object({
  content: z.string(),
  chatId: z.string().includes("--"),
  chatPartner: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    image : z.string().nullable(),
  }),
});