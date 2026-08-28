import { createClient } from "@/lib/supabase/server";
import { HeaderNav } from "./HeaderNav";

export async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return <HeaderNav isSignedIn={Boolean(user)} isAdmin={isAdmin} />;
}
