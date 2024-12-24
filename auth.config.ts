import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isCMSRoute = nextUrl.pathname.startsWith('/CMS')
      
      if (isCMSRoute) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data
        
        // Here you would typically validate against your database
        // This is a simplified example
        if (email === "admin@example.com" && password === "password123") {
          return {
            id: "1",
            email: email,
            name: "Admin User",
            role: "admin",
          }
        }
        
        return null
      },
    }),
  ],
} satisfies NextAuthConfig

