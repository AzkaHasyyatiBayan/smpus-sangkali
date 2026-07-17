import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { signToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { username, password } = req.body
  if (username === process.env.ADMIN_USERNAME && bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH!)) {
    const token = signToken({ username })
    return res.json({ message: 'Login berhasil', token, username })
  }
  res.status(401).json({ error: 'Username atau password salah' })
}