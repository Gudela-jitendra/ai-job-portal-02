import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

interface JobFiltersProps {
  sortOrder: "newest" | "oldest" | "recommended";
  onSortOrderChange: (order: "newest" | "oldest" | "recommended") => void;
}

export const JobFilters = ({ sortOrder, onSortOrderChange }: JobFiltersProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter className="w-4 h-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onSortOrderChange("newest")}>
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortOrderChange("oldest")}>
          Oldest First
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortOrderChange("recommended")}>
          Recommended
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};