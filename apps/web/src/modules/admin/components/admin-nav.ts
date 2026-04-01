import {
  LayoutDashboard,
  MapPinned,
  ClipboardList,
  Mail,
  Users,
  Package,
} from 'lucide-react';

export type AdminNavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  superAdminOnly?: boolean;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Recycling Centers',
    href: '/admin/recycling-centers',
    icon: MapPinned,
  },
  {
    label: 'Material Types',
    href: '/admin/material-types',
    icon: Package,
  },
  {
    label: 'Location Suggestions',
    href: '/admin/location-suggestions',
    icon: ClipboardList,
  },
  {
    label: 'Contact Messages',
    href: '/admin/contact-messages',
    icon: Mail,
  },
  {
    label: 'Admin Users',
    href: '/admin/admin-users',
    icon: Users,
    superAdminOnly: true,
  },
];
