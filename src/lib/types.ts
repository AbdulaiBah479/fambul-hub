export type OpportunityType = "job" | "internship" | "scholarship" | "grant";
export type OpportunityStatus = "pending" | "approved" | "rejected";
export type PosterStatus = "none" | "pending" | "verified" | "rejected";
export type Role = "user" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  bio: string;
  skills: string[];
  location: string;
  phone: string;
  organization: string;
  role: Role;
  poster_status: PosterStatus;
  created_at: string;
}

export interface Opportunity {
  id: string;
  poster_id: string;
  title: string;
  type: OpportunityType;
  organization: string;
  description: string;
  location: string;
  deadline: string | null;
  apply_info: string;
  status: OpportunityStatus;
  created_at: string;
}
