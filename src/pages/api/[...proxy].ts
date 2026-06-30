import type { NextApiRequest, NextApiResponse } from 'next';

const RAILWAY_BASE = 'https://web-production-dc35a.up.railway.app/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = (req.query.proxy as string[]).join('/');
  const search = new URLSearchParams(req.query as Record<string, string>);
  // Hapus 'proxy' dari search params
  search.delete('proxy');
  const queryString = search.toString();
  const url = `${RAILWAY_BASE}/${path}/${queryString ? '?' + queryString : ''}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization as string;
  }

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    fetchOptions.body = JSON.stringify(req.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => null);
    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ error: 'Failed to reach backend' });
  }
}