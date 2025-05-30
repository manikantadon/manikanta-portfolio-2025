"use server";

import { generateToken, setAuthCookie, clearAuthCookie } from "./auth";
import { User, IUser } from "./models/User";
import dbConnect from "./db";
import { LoginCredentials, RegisterCredentials } from "./types";

export async function registerUser(
  credentials: RegisterCredentials
): Promise<{ success: boolean; message?: string; user?: IUser }> {
  try {
    console.log("📝 Registration attempt started for:", credentials.email);
    const { email, password, confirmPassword } = credentials;

    if (!email || !password || !confirmPassword) {
      console.log("❌ Missing fields");
      return { success: false, message: "Missing fields" };
    }

    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match");
      return { success: false, message: "Passwords do not match" };
    }

    if (password.length < 8) {
      console.log("❌ Password too short");
      return {
        success: false,
        message: "Password must be at least 8 characters",
      };
    }

    console.log("🔌 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected");

    // Check if user exists
    console.log("👤 Checking if user exists...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists");
      return { success: false, message: "User already exists" };
    }

    // Create new user
    console.log("👤 Creating new user...");
    const newUser = new User({
      email,
      passwordHash: password, // Will be hashed by pre-save hook
    });

    console.log("💾 Saving user to database...");
    const savedUser = await newUser.save();
    const user = savedUser.toObject();
    console.log("✅ User saved successfully");

    // Generate token and set cookie
    console.log("🎫 Generating token...");
    const token = generateToken(user);
    console.log("🍪 Setting auth cookie...");
    await setAuthCookie(token);
    console.log("✅ Registration successful!");

    return {
      success: true,
      user: {
        _id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as IUser,
    };
  } catch (error: any) {
    console.error("💥 Registration error:", error);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<{ success: boolean; message?: string; user?: IUser }> {
  try {
    console.log("🔐 Login attempt started for:", credentials.email);
    const { email, password } = credentials;

    if (!email || !password) {
      console.log("❌ Missing credentials");
      return { success: false, message: "Missing credentials" };
    }

    console.log("🔌 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected");

    console.log("👤 Looking for user with email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return { success: false, message: "Invalid credentials" };
    }
    console.log("✅ User found:", user.email);

    console.log("🔑 Comparing password...");
    const isValid = await user.comparePassword(password);
    console.log("🔑 Password valid:", isValid);
    if (!isValid) {
      console.log("❌ Invalid password");
      return { success: false, message: "Invalid credentials" };
    }

    console.log("🎫 Generating token...");
    const token = generateToken(user);
    console.log("🍪 Setting auth cookie...");
    await setAuthCookie(token);
    console.log("✅ Login successful!");

    return {
      success: true,
      user: {
        _id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as IUser,
    };
  } catch (error: any) {
    console.error("💥 Login error:", error);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function logoutUser(): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    await clearAuthCookie();
    return { success: true };
  } catch (error: any) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function forgotPassword(
  email: string
): Promise<{ success: boolean; message?: string }> {
  try {
    if (!email) {
      return { success: false, message: "Email is required" };
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message:
          "If an account with that email exists, we have sent a password reset link.",
      };
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it in the database with expiration
    // 3. Send an email with the reset link
    // For now, we'll just simulate this

    console.log(`Password reset requested for: ${email}`);

    return {
      success: true,
      message:
        "If an account with that email exists, we have sent a password reset link.",
    };
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return { success: false, message: "Internal server error" };
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> {
  try {
    if (!token || !newPassword) {
      return { success: false, message: "Missing required information" };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters",
      };
    }

    await dbConnect();

    // In a real application, you would:
    // 1. Verify the token from the database
    // 2. Check if it's expired
    // 3. Find the user associated with the token
    // 4. Update their password
    // 5. Remove the used token

    // For now, we'll simulate a successful password reset
    console.log(`Password reset with token: ${token}`);

    return {
      success: true,
      message: "Password has been reset successfully",
    };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
}
