"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <Button
          onClick={async () => {
            reset();
          }}
        >
          Try again
        </Button>

        <Button
          variant={"destructive"}
          onClick={async () => {
            await signOut();
          }}
        >
          Sign out and Try Again
        </Button>
      </body>
    </html>
  );
}
