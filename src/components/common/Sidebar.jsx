import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  Bell,
  Settings,
  UserCheck,
  Users,
  BadgeDollarSign,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  Megaphone,
  LogOut,
  History,
  LifeBuoy,
  BookOpen,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="mr-2" />,
    route: "/",
  },
  {
    label: "Partner Approvals",
    icon: <UserCheck className="mr-2" />,
    route: "/partner-approvals",
  },
  {
    label: "Partners",
    icon: <Users className="mr-2" />,
    route: "/partners",
  },
  {
    label: "Conversions",
    icon: <FileText className="mr-2" />,
    route: "/conversions",
  },
  {
    label: "Payouts",
    icon: <BadgeDollarSign className="mr-2" />,
    route: "/payouts",
  },
  {
    label: "Commissions",
    icon: <BadgeDollarSign className="mr-2" />,
    route: "/commissions",
  },
  {
    label: "Notifications & Messaging",
    icon: <MessageSquareText className="mr-2" />,
    route: "/notifications",
  },
  {
    label: "Partner Campaigns",
    icon: <Megaphone className="mr-2" />,
    route: "/partner-campaigns",
  },
  {
    label: "Audit Logs",
    icon: <History className="mr-2" />,
    route: "/audit-logs",
  },
  {
    label: "Support Tickets",
    icon: <LifeBuoy className="mr-2" />,
    route: "/support-tickets",
  },
  {
    label: "Content Manager",
    icon: <BookOpen className="mr-2" />,
    route: "/content-manager",
  },
  {
    label: "Announcements",
    icon: <Megaphone className="mr-2" />,
    route: "/announcements",
  },
  {
    label: "Settings",
    icon: <Settings className="mr-2" />,
    route: "/settings",
  },
];

const Sidebar = ({ setUser, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
      <div>
        <div className="mb-6">
          <img
            src="https://www.cronberry.com/images/cronberry-logo.svg"
            alt="Cronberry Logo"
            className="h-10"
          />
        </div>
        <div className="flex flex-col space-y-2">
          {menuItems.map(({ label, icon, route }) => (
            <Button
              key={label}
              className="justify-start cursor-pointer"
              variant={isActive(route) ? "default" : "ghost"}
              onClick={() => {
                if (route) {
                  navigate(route);
                } else {
                  setUser(null);
                  setIsLoggedIn(false);
                  localStorage.removeItem("user");
                  navigate("/login");
                }
              }}
            >
              {icon} {label}
            </Button>
          ))}
        </div>
      </div>
      <Button
        variant="ghost"
        className="justify-start w-full text-red-600 cursor-pointer"
      >
        <LogOut className="mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
