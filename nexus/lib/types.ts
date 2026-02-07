export type ProfileRole = "admin" | "client";

export interface Profile {
  id: string;
  role: ProfileRole;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  price: number;
  stock: number;
  image_url: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  event_id: string;
  purchase_date: string;
  status: "confirmed" | "cancelled";
  created_at: string;
}
