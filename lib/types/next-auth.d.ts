import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: number | string
    name: string
    email: string
    image: string
    role: string
    active: boolean
    provider: string
    createdAt: string
    updatedAt: string
    token: string
    tokenExpires: string
  }
  interface Session {
    user: User
  }
}
