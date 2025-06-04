"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const birthdate = formData.get("birthdate")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  console.log(birthdate)
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/auth/register",
      "Email and password are required"
    );
  }

  if (!name) {
    return encodedRedirect(
      "error",
      "/auth/register",
      "Name is required"
    );
  }

  // Proceed with signup
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/login`,
      data: {
        name,
        birthdate,
      },
    },
  });

  if (signUpError) {
    if (signUpError.message.toLowerCase().includes("user already registered")) {
      return redirect("/auth/register/user-exists");
    }

    console.error(signUpError.code + " " + signUpError.message);
    return encodedRedirect("error", "/auth/register", signUpError.message);
  }

  const userId = signUpData.user?.id;

  if (!userId) {
    return encodedRedirect(
      "error",
      "/auth/register",
      "User ID not returned after signup"
    );
  }

  // Insert into client table immediately (before email verification)
  // This ensures the profile exists when they verify their email
  const { error: insertError } = await supabase.from("client").insert({
    user_id: userId,
    full_name: name,
    birthdate: birthdate,
    role: "client",
    created_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error("Failed to create client profile:", insertError);
       
    return encodedRedirect(
      "error",
      "/auth/register",
      "Failed to create user profile. Please try again."
    );
  }

  return encodedRedirect(
    "success",
    "/auth/register/email-verification",
    "Thanks for signing up! Please check your email for a verification link."
  );
};



export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/login", error.message);
  }

  return redirect("/dashboard"); 
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
