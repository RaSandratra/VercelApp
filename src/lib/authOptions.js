import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
    
        if (!credentials?.email || !credentials?.password) return null
        try {
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email },
          })
          if (admin && await bcrypt.compare(credentials.password, admin.password)) {
            return { id: admin.id, email: admin.email }
          }
        } catch (error) {
          console.error("Auth error:", error)
        }
        return null
      },
    }),
  ],

  secret: "8d9f2a6b7c1e4f5a9b3d8e7c6f2a1b4d",
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id
      return session
    },
  },
}

console.log("SECRET:", process.env.NEXTAUTH_SECRET)
