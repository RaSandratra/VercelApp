import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  secret: "8d9f2a6b7c1e4f5a9b3d8e7c6f2a1b4d",

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        })

        if (!admin) return null

        const valid = await bcrypt.compare(
          credentials.password,
          admin.password
        )

        if (!valid) return null

        return {
          id: admin.id,
          email: admin.email,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },

  pages: {
    signIn: "/admin/login",
  },
})

export { handler as GET, handler as POST }