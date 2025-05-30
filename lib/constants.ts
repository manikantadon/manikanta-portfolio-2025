// Shared constants for authentication
export const JWT_SECRET = process.env.JWT_SECRET || "Manikantadon123";
export const COOKIE_NAME = "auth_token";
export const MAX_AGE = 60 * 60 * 24 * 7; // 1 week
