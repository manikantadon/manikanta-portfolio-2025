"use client";

import { IUser } from "./models/User";

// Client-side function to get the current user
export async function getClientSession(): Promise<IUser | null> {
  try {
    const response = await fetch("/api/auth/session");
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

// Client-side function to log out
export async function logoutClient(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      window.location.href = "/login";
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error logging out:", error);
    return false;
  }
}
