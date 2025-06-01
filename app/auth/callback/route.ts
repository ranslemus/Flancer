import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  // const code = url.searchParams.get("code");
  const next = url.searchParams.get("redirect_to") || "/dashboard";
  
  const supabase = createClient(); // Add await here


    // Step 1: Exchange code for session
    // const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    // if (exchangeError) {
    //   console.error("Exchange error:", exchangeError); // Add logging
    //   return NextResponse.redirect(`${url.origin}/auth/error?message=${encodeURIComponent(exchangeError.message)}`);
    // }

    // Step 2: Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User error:", userError); // Add logging
      return NextResponse.redirect(`${url.origin}/auth/error?message=Failed to fetch user`);
    }

    // Step 3: Insert into client table if not already exists
    const { data: existingClient } = await supabase
      .from("client")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingClient) {
      const { error: insertError } = await supabase.from("client").insert({
        user_id: user.id,
        full_name: user.user_metadata?.name || "",
        birthdate: user.user_metadata?.birthdate || null,
        role: "client",
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Failed to insert client:", insertError.message);
        return NextResponse.redirect(`${url.origin}/auth/error?message=Client profile creation failed`);
      }
    }
  

  return NextResponse.redirect(`${url.origin}${next}`);
}