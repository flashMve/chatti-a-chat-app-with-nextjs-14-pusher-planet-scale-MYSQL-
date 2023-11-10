'use client'

import React, { FC } from 'react'
import { Toaster } from './ui/toaster'
import { SessionProvider } from "next-auth/react"



interface ProvidersProps {
  children:React.ReactNode
}

const Providers: FC<ProvidersProps> = ({children}) => {
    return <SessionProvider>
        {children}
        <Toaster />
    </SessionProvider>
}

export default Providers