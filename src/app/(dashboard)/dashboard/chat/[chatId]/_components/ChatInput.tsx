"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Session } from "next-auth";
import { FC, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import { User } from "@prisma/client";

interface ChatInputProps {
  session: Session | null;
  chatPartner: User | null;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ session, chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sendMessage = async () => {
    if (!session || !chatPartner || input.length <= 0) return;
    setLoading(true);
    try {
      const message = {
        content: input,
        chatId: chatId,
      };

      const res = await axios.post("/api/message/send", {
        ...message,
        chatPartner
      });

      if (res.status === 200) {
        setInput("");
        textareaRef.current?.focus();
      }
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        console.log('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t-[0.1px] border-gray-600 pl-4 px-6 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 flex overflow-hidden rounded-lg shadow-sm ring-1 ring-inset focus-within:ring-2 focus-within:ring-indigo-600">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={!session || !chatPartner || loading}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder={`Message ${chatPartner?.name}`}
          className="block w-full pl-4 resize-none border-0 bg-transparent text-gray-50 placeholder-gray-50  sm:text-sm sm:leading-6 sm:py-1.5"
        />

        
        <div className="absolute right-0 bottom-0 flex justify-between pl-3">
          <div className="flex-shrink-0">
            <Button
              type="submit"
              onClick={sendMessage}
              disabled={!session || !chatPartner || loading}
            >
              POST
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
