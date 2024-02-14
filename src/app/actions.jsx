"use server";

import { cookies } from "next/headers";
import { logout, login, encrypt, decrypt } from "@/utils/auth";

export async function handleLogout() {
  return await logout();
}

export async function handleLogin(_, formAction) {
  try {
    const password = formAction?.get("password");
    if (!password) return;
    const result = await login({ password });

    if (!result.success) {
      return result.error;
    }

    return result.success;
  } catch (error) {
    if (error) {
      switch (error.type) {
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function refreshSession() {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) return { error: "Session not found", success: false };

    const sessionData = await decrypt(sessionCookie);
    const updatedSessionData = {
      ...sessionData,
      expires: new Date(Date.now() + 3600 * 1000),
    };

    const encryptedSession = await encrypt(updatedSessionData);
    cookies().set("session", encryptedSession, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return { success: true };
  } catch (error) {
    return { error: "An error occurred", details: error.message };
  }
}
