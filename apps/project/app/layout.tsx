import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './components/NavBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CollabSpace - Real-time Collaboration Platform',
  description: 'Connect, communicate, and create together with integrated chat and whiteboard features.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body  className={inter.className + ' bg-neutral-900 min-h-screen flex flex-col'}>
        <NavBar />
        {children}</body>
    </html>
  )
}