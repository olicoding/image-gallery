"use server";

import { login, logout } from "@/utils/auth";

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

export async function handleLogout() {
  return await logout();
}
