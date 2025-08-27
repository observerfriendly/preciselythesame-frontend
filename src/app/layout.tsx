import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Precisely The Same',
  description: 'A modern full-stack application with Vercel, Neon, and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
