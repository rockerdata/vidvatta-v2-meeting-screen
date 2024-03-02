import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { cn } from "src/lib/utils"
import Navbar from "src/components/navbar/navbar"
import { Amplify } from 'aws-amplify';
import amplifyconfig from 'src/amplifyconfiguration.json';
import '@aws-amplify/ui-react/styles.css';
Amplify.configure(amplifyconfig);

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: 'Vidvatta',
  description: 'Where Mentors and Students can collaborate together',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Navbar />
        {children}
        
        </body>
    </html>
  )
}
