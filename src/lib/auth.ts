import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const AUTH_SECRET = process.env.AUTH_SECRET!

export function verifyToken(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Token ')) {
    res.status(401).json({ error: 'Token tidak ditemukan' })
    return false
  }
  try {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, AUTH_SECRET)
    return true
  } catch {
    res.status(401).json({ error: 'Token tidak valid' })
    return false
  }
}

export function signToken(payload: object) {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: '7d' })
}