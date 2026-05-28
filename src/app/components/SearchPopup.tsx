import { useState, useEffect } from "react";
import { Search, Clock, Filter, Star } from "lucide-react";
import { Palace } from "../hooks/useProgressState";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  palaces: Palace[];
  onSelectPalace: (palaceId: string) => void;
}

export function SearchPopup({
  isOpen,
  onClose,
  palaces,
  onSelectPalace,
}: SearchPopupProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [recentSearches] = useState([
    "Greek Mythology",
    "Solar System",
    "World Capitals",
  ]);

  const categories = ["All", ...Array.from(new Set(palaces.map(p => p.category)))];

  const filteredPalaces = palaces.filter((palace) => {
    return selectedCategory === "All" || palace.category === selectedCategory;
  });

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Command className="bg-transparent">
        <div className="flex items-center px-3 pb-2 pt-3 border-b border-[#E5E5EA]">
          <CommandInput placeholder="Search palaces..." className="border-none focus:ring-0 bg-transparent" />
        </div>
        
        {/* Category Filters inside dialog */}
        <div className="flex gap-[8px] overflow-x-auto scrollbar-hide px-3 py-2 border-b border-[#E5E5EA]">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-[16px] py-[6px] rounded-full text-[13px] font-medium transition-all ${
                selectedCategory === category
                  ? "bg-[#091A7A] text-white shadow-sm"
                  : "bg-[#F5F5F7] text-[#86868B]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <CommandList className="max-h-[50vh] p-2">
          <CommandEmpty>No palaces found.</CommandEmpty>
          
          <CommandGroup heading="Recent Searches">
            {recentSearches.map((search) => (
              <CommandItem key={search} value={search} className="gap-2 cursor-pointer">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {search}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={`Palaces (${filteredPalaces.length})`}>
            {filteredPalaces.map((palace) => (
              <CommandItem
                key={palace.id}
                value={palace.name}
                onSelect={() => {
                  onSelectPalace(palace.id);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 cursor-pointer rounded-xl my-1 border border-transparent aria-selected:border-[#091A7A]/20 aria-selected:bg-[#091A7A]/5"
              >
                <div className="text-2xl">{palace.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#091A7A]">{palace.name}</h4>
                  <p className="text-xs text-[#091A7A]/60 line-clamp-1">{palace.description}</p>
                </div>
                {palace.progress === 100 && (
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}