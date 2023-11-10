'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-4'>
      <h2 className='text-bold text-6xl lg:text-5xl font-bold bg-gradient-to-r text-transparent bg-clip-text from-violet-500 to-pink-500'>Something went wrong!</h2>
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
    </div>
  )
}