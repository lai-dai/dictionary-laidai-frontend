import { User } from 'next-auth'

export function isAdmin(user?: User) {
  return user?.role === 'admin'
}
