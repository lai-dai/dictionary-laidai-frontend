import NextAuth from 'next-auth'

import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'

import { env } from '@/lib/env'
import { api } from './api'
import { API_INPUTS } from './constants/api-input'
import { getErrorMessage } from './utils/error-message'
import { ResFindOne } from './types/common'
import { CredentialsAccount } from './types/auth'

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  pages: {
    error: '/login',
    signIn: '/login',
    newUser: '/register',
  },
  callbacks: {
    async signIn({ user, account }) {
      return true
    },
    async jwt({ token, account, trigger, user }) {
      switch (trigger) {
        case 'signIn':
          switch (account?.provider) {
            case 'google':
              break

            case 'credentials':
              if (user) {
                token.role = user.role
                token.active = user.active
                token.createdAt = user.createdAt
                token.image = user.image
                token.provider = user.provider
                token.createdAt = user.createdAt
                token.updatedAt = user.updatedAt
                token.token = user.token
              }
              break
          }
          break
      }

      return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as string
      }

      if (session.user) {
        session.user.role = token.role as string
        session.user.active = token.active as boolean
        session.user.createdAt = token.createdAt as string
        session.user.provider = token.provider as string
        session.user.createdAt = token.createdAt as string
        session.user.updatedAt = token.updatedAt as string
        session.user.token = token.token as string
      }

      return session
    },
  },
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 86400,
  },
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials
          const res = await api.post<ResFindOne<CredentialsAccount>>(
            API_INPUTS.login,
            { email, password }
          )
          const { token, user } = res.data
          return { ...user, token }
        } catch (error) {
          console.error('💥 error', error)
          throw new Error(
            getErrorMessage(error, 'Có lỗi xảy ra, vui lòng thử lại sau!')
          )
        }
      },
    }),
  ],
})
