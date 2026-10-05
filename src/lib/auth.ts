import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

const getJwtSecret = () => process.env.JWT_SECRET || "fallback_secret_for_development_only";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "student" | "admin";
  name?: string;
  avatarSeed?: string;
  tokenVersion?: number;
}

export const getAuthSessionFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const token = getCookie("auth_token");
    if (!token) return null;
    
    try {
      const jwt = (await import("jsonwebtoken")).default || await import("jsonwebtoken");
      const payload = jwt.verify(token, getJwtSecret()) as TokenPayload;
      
      const { connectDB } = await import("./db");
      const { User } = await import("./models/User");
      await connectDB();
      const user = await User.findById(payload.userId).lean();
      
      if (!user || user.suspended || (user.tokenVersion || 0) !== (payload.tokenVersion || 0)) {
        return null;
      }

      // True Rolling Session: Generate a brand new token with a fresh expiration
      const newToken = jwt.sign({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        name: user.name,
        avatarSeed: user.avatarSeed,
        tokenVersion: payload.tokenVersion
      }, getJwtSecret(), { expiresIn: "2h" });

      // Update the cookie with the new token
      setCookie("auth_token", newToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 2 * 60 * 60 // 2 hours
      });
      
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        name: user.name,
        avatarSeed: user.avatarSeed || user.name.replace(/\s+/g, ""),
        tokenVersion: payload.tokenVersion
      };
    } catch (error) {
      return null;
    }
  });

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { email, password } = data;
      
      const jwt = (await import("jsonwebtoken")).default || await import("jsonwebtoken");


      const { connectDB } = await import("./db");
      const { User } = await import("./models/User");
      const bcrypt = (await import("bcryptjs")).default || await import("bcryptjs");

      await connectDB();
      
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error("Invalid email or password");
      }
      
      if (user.suspended) {
        throw new Error("Your account has been suspended. Contact support for more information.");
      }
      
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }
      
      const token = jwt.sign({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        avatarSeed: user.avatarSeed || user.name.replace(/\s+/g, ""),
        tokenVersion: user.tokenVersion || 0
      }, getJwtSecret(), { expiresIn: "2h" });
      
      setCookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 2 * 60 * 60 // 2 hours
      });
      
      return { success: true, role: user.role };
    } catch (error: any) {
      console.error("SERVER FUNCTION ERROR:", error.stack || error);
      throw error;
    }
  });

export const logoutFn = createServerFn({ method: "POST" })
  .handler(async () => {
    deleteCookie("auth_token", { path: "/" });
    return { success: true };
  });
