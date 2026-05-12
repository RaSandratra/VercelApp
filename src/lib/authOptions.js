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
        // BUG FIX: Validation des credentials avant la requête DB
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
  // BUG FIX: secret explicitement défini (obligatoire en production)
  secret: process.env.NEXTAUTH_SECRET,
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
