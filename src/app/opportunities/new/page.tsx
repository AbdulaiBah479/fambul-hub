import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewOpportunityForm } from "@/components/NewOpportunityForm";
import type { Profile } from "@/lib/types";

export default async function NewOpportunityPage() {
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

  if (!profile || profile.poster_status !== "verified") redirect("/profile");

  return <NewOpportunityForm posterId={user.id} />;
}
