import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not set');
}

export function generateAccessToken(payload: {
  userId: number;
}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as {
    userId: number;
  };
}
