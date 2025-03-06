"use client";

import { cn } from " @/lib/utils";
import { Check } from "lucide-react";

interface Category {
  label: string;
  id: string | number; // Adjust as needed
}

interface ListItemProps {
  category: Category;
  onSelect: (category: Category) => void;
  isChecked: boolean;
}

export const ListItem = ({ category, onSelect, isChecked }: ListItemProps) => {
  return (
    <div
      className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50 text-muted-foreground hover:text-primary"
      onClick={() => onSelect(category)}
      role="button"
      aria-pressed={isChecked ? "true" : "false"}  // Explicitly set aria-pressed to "true" or "false"
    >
      <Check
        className={cn(
          "ml-auto h-4 w-4",
          isChecked ? "opacity-100" : "opacity-0"
        )}
      />
      <p className="w-full truncate text-sm whitespace-nowrap">
        {category.label || "No Label"}
      </p>
    </div>
  );
};