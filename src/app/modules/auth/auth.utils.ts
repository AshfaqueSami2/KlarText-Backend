import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
): string => {
  if (!secret) {
    throw new Error('JWT secret is required');
  }
  
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};