import { LucideIcon } from "lucide-react";

export type AdminStatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  href?: string;
  description?: string;
};
