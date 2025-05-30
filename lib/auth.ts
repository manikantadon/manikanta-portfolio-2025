import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { IUser } from "./models/User";
import dbConnect from "./db";
import { User } from "./models/User";
import { JWT_SECRET, COOKIE_NAME, MAX_AGE } from "./constants";

export function generateToken(user: IUser): string {
  return jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

export async function getSession(): Promise<IUser | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;

  if (!cookie) return null;

  try {
    const decoded = verifyToken(cookie);
    if (!decoded) return null;

    await dbConnect();
    const user = await User.findById(decoded.userId).lean();

    if (!user) return null;

    const userData = user as any;
    return {
      _id: userData._id.toString(),
      email: userData.email,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    } as IUser;
  } catch (error) {
    return null;
  }
}
