import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Clock, Filter, Star } from "lucide-react";
import { Palace } from "../hooks/useProgressState";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches] = useState([
    "Greek Mythology",
    "Solar System",
    "World Capitals",
  ]);

  const categories = ["All", ...Array.from(new Set(palaces.map(p => p.category)))];

  const filteredPalaces = palaces.filter((palace) => {
    const matchesSearch =
      palace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      palace.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      palace.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || palace.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 400,
            }}
            className="absolute top-[80px] left-[20px] right-[20px] bg-white rounded-[24px] shadow-2xl overflow-hidden z-50 max-h-[75vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="px-[16px] py-[12px] border-b border-[#E5E5EA] space-y-3">
              <div className="flex items-center gap-[12px]">
                <div className="flex-1 flex items-center gap-[12px] bg-[#F5F5F7] rounded-[12px] px-[12px] py-[10px]">
                  <Search
                    size={20}
                    className="text-[#86868B] flex-shrink-0"
                  />
                  <input
                    type="text"
                    placeholder="Search palaces..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="flex-1 text-[17px] text-[#000000] placeholder:text-[#86868B] outline-none bg-transparent"
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="w-[20px] h-[20px] rounded-full bg-[#86868B] flex items-center justify-center text-white flex-shrink-0"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center flex-shrink-0 transition-colors ${
                    showFilters ? "bg-[#007AFF] text-white" : "bg-[#F5F5F7] text-[#86868B]"
                  }`}
                >
                  <Filter size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Category Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-[8px] overflow-x-auto scrollbar-hide pb-1">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`flex-shrink-0 px-[16px] py-[6px] rounded-full text-[13px] font-medium transition-all ${
                            selectedCategory === category
                              ? "bg-[#007AFF] text-white shadow-sm"
                              : "bg-[#F5F5F7] text-[#86868B]"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={onClose}
                className="absolute top-[16px] right-[16px] text-[17px] text-[#007AFF] font-medium"
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                }}
              >
                Cancel
              </button>
            </div>

            {/* Search Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {searchQuery === "" ? (
                // Recent Searches & Quick Access
                <div className="p-[16px]">
                  {/* Recent Searches */}
                  <div className="mb-[24px]">
                    <h3
                      className="text-[13px] font-semibold text-[#86868B] uppercase tracking-wide mb-[12px]"
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      Recent Searches
                    </h3>
                    <div className="space-y-[4px]">
                      {recentSearches.map((search, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="w-full flex items-center gap-[12px] px-[12px] py-[10px] rounded-[12px] hover:bg-[#F5F5F7] transition-colors text-left"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="w-[32px] h-[32px] bg-[#F5F5F7] rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock
                              size={16}
                              className="text-[#86868B]"
                            />
                          </div>
                          <span
                            className="text-[16px] text-[#000000] flex-1"
                            style={{
                              fontFamily:
                                '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                            }}
                          >
                            {search}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Tip */}
                  <div className="bg-gradient-to-br from-[#007AFF]/10 to-[#007AFF]/5 rounded-[16px] p-[16px] border border-[#007AFF]/20">
                    <div className="flex items-start gap-[12px]">
                      <div className="text-[24px]">💡</div>
                      <div>
                        <h4
                          className="text-[15px] font-semibold text-[#000000] mb-[4px]"
                          style={{
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                          }}
                        >
                          Quick Tip
                        </h4>
                        <p
                          className="text-[13px] text-[#86868B]"
                          style={{
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                          }}
                        >
                          Search by palace name, category, or
                          description to find what you're
                          looking for.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : filteredPalaces.length > 0 ? (
                // Search Results with Preview Cards
                <div className="p-[16px]">
                  <div className="flex items-center justify-between mb-[12px]">
                    <h3
                      className="text-[13px] font-semibold text-[#86868B] uppercase tracking-wide"
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {filteredPalaces.length} {filteredPalaces.length === 1 ? "Result" : "Results"}
                    </h3>
                    {selectedCategory !== "All" && (
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className="text-[13px] text-[#007AFF] font-medium"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-[12px]">
                    {filteredPalaces.map((palace, index) => (
                      <motion.button
                        key={palace.id}
                        onClick={() => {
                          onSelectPalace(palace.id);
                          onClose();
                        }}
                        className="relative bg-white rounded-[20px] p-[14px] border-2 border-[#E5E5EA] hover:border-[#007AFF] hover:shadow-lg transition-all text-left overflow-hidden group"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.04, type: "spring", stiffness: 300 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        {/* Gradient Background */}
                        <div
                          className={`absolute top-0 right-0 w-[90px] h-[90px] bg-gradient-to-br ${palace.color} opacity-10 group-hover:opacity-20 transition-opacity rounded-bl-[70px]`}
                        />

                        <div className="relative">
                          {/* Icon */}
                          <div className="text-[42px] mb-[10px] leading-none">
                            {palace.icon}
                          </div>

                          {/* Title */}
                          <h4
                            className="text-[15px] font-bold text-[#000000] mb-[6px] line-clamp-1"
                            style={{
                              fontFamily:
                                '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                            }}
                          >
                            {palace.name}
                          </h4>

                          {/* Description */}
                          <p
                            className="text-[12px] text-[#86868B] mb-[10px] line-clamp-2 min-h-[32px] leading-snug"
                            style={{
                              fontFamily:
                                '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                            }}
                          >
                            {palace.description}
                          </p>

                          {/* Category Badge & Completion */}
                          <div className="flex items-center gap-2 mb-[10px]">
                            <span className="inline-block px-[10px] py-[3px] bg-gradient-to-r from-[#F5F5F7] to-[#E5E5EA] rounded-full text-[10px] text-[#86868B] font-semibold">
                              {palace.category}
                            </span>
                            {palace.progress === 100 && (
                              <div className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                              </div>
                            )}
                          </div>

                          {/* Stats Row */}
                          <div className="flex items-center justify-between mb-[8px]">
                            <span className="text-[11px] text-[#86868B] font-medium">
                              {palace.roomsCompleted}/{palace.totalRooms} rooms
                            </span>
                            <span className="text-[12px] font-bold text-[#007AFF]">
                              {palace.progress}%
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="h-[5px] bg-[#F5F5F7] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${palace.progress}%` }}
                              transition={{ delay: index * 0.04 + 0.2, duration: 0.6, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-[#007AFF] to-[#0051D5] rounded-full"
                            />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                // No Results
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-[48px] px-[20px]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="text-[64px] mb-[16px]"
                  >
                    🔍
                  </motion.div>
                  <h3
                    className="text-[20px] font-bold text-[#000000] mb-[8px]"
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    }}
                  >
                    No palaces found
                  </h3>
                  <p
                    className="text-[15px] text-[#86868B] text-center"
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    Try searching with different keywords
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}