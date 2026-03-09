import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SESSION_COOKIE = 'auth-token'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(data: any): string {
  return jwt.sign(data, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function setSessionCookie(userId: string, email: string, role: string): Promise<void> {
  const cookieStore = await cookies()
  const token = generateToken({ userId, email, role })

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getSessionData(): Promise<{ userId: string; email: string; role: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null

  const data = verifyToken(token)
  return data || null
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function withAdminAuth(request: NextRequest, requiredRole: string = 'admin') {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (!token) {
      return { authorized: false, data: null }
    }

    const data = verifyToken(token)

    if (!data) {
      return { authorized: false, data: null }
    }

    const hasRequiredRole =
      requiredRole === 'editor'
        ? ['admin', 'editor'].includes(data.role)
        : data.role === requiredRole

    if (!hasRequiredRole) {
      return { authorized: false, data, reason: 'Insufficient permissions' }
    }

    return { authorized: true, data }
  } catch (error) {
    return { authorized: false, data: null, error: String(error) }
  }
}
