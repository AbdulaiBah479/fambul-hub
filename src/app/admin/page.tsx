import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPanel } from "@/components/AdminPanel";
import type { Opportunity, Profile } from "@/lib/types";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile || profile.role !== "admin") redirect("/");

  const { data: pendingPosters } = await supabase
    .from("profiles")
    .select("*")
    .eq("poster_status", "pending")
    .returns<Profile[]>();

  const { data: pendingListings } = await supabase
    .from("opportunities")
    .select("*")
    .eq("status", "pending")
    .returns<Opportunity[]>();

  return (
    <AdminPanel pendingPosters={pendingPosters ?? []} pendingListings={pendingListings ?? []} />
  );
}
