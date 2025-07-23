// components/HeaderTabs.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Settings, MessageSquare } from "lucide-react"; // Assuming you're using lucide-react for icons
import {Side_clarifyAi} from "@/components/icons/CodeSensei/codesenseiIcons"; // Adjust the import path as necessary
interface HeaderTabsProps {
  activeModule: string;
   onHistoryClick: () => void;
   onNewChat: () => void;
  onSearchChat: () => void; 
  onConfigurationClick?: () => void; // Optional callback for configuration click
}

type TabOption = {
  label: string;
  icon: React.ReactNode; // Use ReactNode to allow JSX elements
};

export default function HeaderTabs({ activeModule, onHistoryClick, onNewChat, onSearchChat, onConfigurationClick }: HeaderTabsProps) {
  const [activeTab, setActiveTab] = useState<TabOption | null>(null);

  const tabs: TabOption[] = [
  {
    label: "Configuration",
    icon: <Settings />,
  },
  {
    label: "Search Chat",
    icon: <Search />,
  },
  {
    label: "Chat History",
    icon: <MessageSquare />,
  },
  {
    label: "New Chat",
    icon: <Side_clarifyAi/>,
  },
];
  if (activeModule !== "CodeSensei") return null;

  return (
    <div className="flex justify-end items-center w-full p-4">
      <div className="flex gap-3 items-center">
        {tabs.map((tab) => (
          <Button
            key={tab.label}
            variant={tab.label === "New Chat" ? "default" : "ghost"}
            className={cn(
              "rounded-full w-25 text-[10px] h-[9] px-7 text-white",
              tab.label === "New Chat"
                ? "dark:bg-[white] bg-[black] dark:text-black text-white dark:hover:bg-gray-100 hover:bg-gray-800" 
                : "bg-[#ccc] dark:bg-[#262626] hover:bg-black hover:text-white dark:hover:bg-[#333]  dark:text-white text-black"
            )}
           onClick={() => {
  setActiveTab(tab);
  if (tab.label === "Chat History") onHistoryClick();
  if (tab.label === "New Chat") onNewChat(); // ✅ Call the reset function
    if (tab.label === "Search Chat") onSearchChat(); 
  if (tab.label === "Configuration" && onConfigurationClick) {
    onConfigurationClick(); // Call the configuration click handler if provided
  }
}}
          >
            <span className="flex items-center gap-1">
              {typeof tab.icon === "string" ? (
                <img src={tab.icon} alt={tab.label} className="w-4 h-4" />
              ) : (
                tab.icon
              )}
              {tab.label}
            </span>
          </Button>
        ))}
      </div>
            
    </div>
  );
}
