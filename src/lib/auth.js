// src/lib/auth.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateJWT(email) {
  return jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyJWT(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function hashOTP(otp) {
  const saltRounds = 10;
  return await bcrypt.hash(otp, saltRounds);
}

export async function verifyOTP(plainOTP, hashedOTP) {
  return await bcrypt.compare(plainOTP, hashedOTP);
}