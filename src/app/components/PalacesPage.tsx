import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Grid,
  List,
  SlidersHorizontal,
  ChevronRight,
  Star,
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { StatusBar } from "./ui";
import { DynamicBackground } from "./DynamicBackground";
import { AmbientParticles } from "./AmbientParticles";
import { Palace } from "../hooks/useProgressState";
import { PalaceCard } from "./cards/PalaceCard";
import { FeaturedPalaceBanner } from "./cards/FeaturedPalaceBanner";

interface PalacesPageProps {
  palaces: Palace[];
  onSearch: () => void;
  onPalaceClick: (palaceId: string) => void;
  onCreatePalace: () => void;
  onEditPalace: (palaceId: string) => void;
  onDeletePalace: (palaceId: string) => void;
}

export function PalacesPage({
  palaces,
  onSearch,
  onPalaceClick,
  onCreatePalace,
  onEditPalace,
  onDeletePalace,
}: PalacesPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    "grid",
  );
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [sortBy, setSortBy] = useState("Recent");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const categories = [
    "All",
    "Science",
    "History",
    "Geography",
    "Technology",
  ];
  const sortOptions = [
    "Recent",
    "Progress",
    "Name",
    "Category",
  ];

  const filteredPalaces =
    selectedCategory === "All"
      ? palaces
      : palaces.filter((p) => p.category === selectedCategory);

  const sortedPalaces = [...filteredPalaces].sort((a, b) => {
    switch (sortBy) {
      case "Progress":
        return b.progress - a.progress;
      case "Name":
        return a.name.localeCompare(b.name);
      case "Category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return (
    <div className="size-full flex flex-col relative">
      {/* Dynamic Background */}
      <DynamicBackground />

      {/* Ambient Particles */}
      <AmbientParticles />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#091A7A]/95 to-[#4F8EFF]/95 relative flex-shrink-0 backdrop-blur-md">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]" />

          {/* Status Bar */}
          <div className="relative z-10">
            <StatusBar textColor="white" />
          </div>

          {/* Header Content */}
          <div className="px-[20px] pt-[12px] pb-[20px] relative z-10">
            <div className="flex items-center justify-between mb-[16px]">
              <h1 className="text-[32px] font-bold text-white">
                All Palaces
              </h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={onSearch}
                  className="w-[44px] h-[44px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Search size={20} strokeWidth={2.5} />
                </button>
                <button
                  onClick={onCreatePalace}
                  className="w-[44px] h-[44px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Plus size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-[12px]">
              <div className="flex-1 bg-white/15 backdrop-blur-md rounded-[16px] p-[4px] flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[12px] transition-all ${
                    viewMode === "grid"
                      ? "bg-white/90 text-[#007AFF]"
                      : "text-white/80"
                  }`}
                >
                  <Grid size={18} strokeWidth={2.5} />
                  <span className="text-[15px] font-medium">
                    Grid
                  </span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[12px] transition-all ${
                    viewMode === "list"
                      ? "bg-white/90 text-[#007AFF]"
                      : "text-white/80"
                  }`}
                >
                  <List size={18} strokeWidth={2.5} />
                  <span className="text-[15px] font-medium">
                    List
                  </span>
                </button>
              </div>

              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="w-[44px] h-[44px] rounded-[16px] bg-white/15 backdrop-blur-md flex items-center justify-center text-white"
              >
                <SlidersHorizontal
                  size={20}
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Sort Menu */}
        <AnimatePresence>
          {showSortMenu && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 z-40"
                onClick={() => setShowSortMenu(false)}
              />

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                className="absolute top-[180px] right-[20px] bg-white rounded-[20px] shadow-2xl border border-[#E5E5EA] z-50 overflow-hidden min-w-[180px]"
              >
                <div className="p-3">
                  <p className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider px-3 py-2">
                    Sort By
                  </p>
                  {sortOptions.map((option, index) => (
                    <motion.button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortMenu(false);
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-[16px] py-[10px] text-left rounded-[12px] transition-all flex items-center justify-between mb-1 ${
                        sortBy === option
                          ? "bg-gradient-to-r from-[#007AFF]/10 to-[#007AFF]/5 border border-[#007AFF]/30"
                          : "hover:bg-[#F5F5F7]"
                      }`}
                    >
                      <span
                        className={`text-[15px] font-medium ${
                          sortBy === option ? "text-[#007AFF]" : "text-[#000000]"
                        }`}
                      >
                        {option}
                      </span>
                      {sortBy === option && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-[#007AFF]"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Category Filter */}
          <div className="px-[20px] py-[16px] border-b border-[#E5E5EA] sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm">
            <div className="flex gap-[8px] overflow-x-auto scrollbar-hide pb-1">
              {categories.map((category, index) => {
                const count = category === "All"
                  ? palaces.length
                  : palaces.filter(p => p.category === category).length;

                return (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex-shrink-0 px-[18px] py-[10px] rounded-full transition-all shadow-sm ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white shadow-md"
                        : "bg-white text-[#86868B] border-2 border-[#E5E5EA]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold">
                        {category}
                      </span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                        selectedCategory === category
                          ? "bg-white/25 text-white"
                          : "bg-[#F5F5F7] text-[#86868B]"
                      }`}>
                        {count}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Palaces Count & Sort Info */}
          <div className="px-[20px] py-[12px] flex items-center justify-between">
            <p className="text-[15px] font-medium text-[#000000]">
              {sortedPalaces.length}{" "}
              {sortedPalaces.length === 1 ? "Palace" : "Palaces"}
            </p>
            {sortBy !== "Recent" && (
              <p className="text-[13px] text-[#86868B]">
                Sorted by {sortBy}
              </p>
            )}
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-[20px] pb-[100px] space-y-6"
            >
              {/* Featured Banner - shown only on first load */}
              {selectedCategory === "All" && sortBy === "Recent" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <FeaturedPalaceBanner
                    title="palaces"
                    subtitle="Discover Available"
                    count={`${sortedPalaces.length}+`}
                    icon="🏛️"
                    onExplore={() => {}}
                  />
                </motion.div>
              )}

              {/* Palace Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                {sortedPalaces.map((palace, index) => (
                  <motion.div
                    key={palace.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    className="relative"
                  >
                    <div onClick={() => onPalaceClick(palace.id)}>
                      <PalaceCard
                        id={palace.id}
                        name={palace.name}
                        description={palace.description}
                        icon={palace.icon}
                        progress={palace.progress}
                        totalRooms={palace.totalRooms}
                        roomsCompleted={palace.roomsCompleted}
                        estimatedTime={`${Math.floor(palace.totalRooms * 8 / 60)}h ${(palace.totalRooms * 8) % 60}min`}
                        difficulty={
                          palace.totalRooms < 5
                            ? "Beginner"
                            : palace.totalRooms < 10
                            ? "Intermediate"
                            : "Advanced"
                        }
                        rating={4.9}
                        variant="compact"
                        onClick={() => {}}
                      />
                    </div>

                    {/* Menu Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === palace.id ? null : palace.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg z-10"
                    >
                      <MoreVertical size={16} className="text-[#000000]" />
                    </motion.button>

                    {/* Menu Popup */}
                    <AnimatePresence>
                      {activeMenuId === palace.id && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-20"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute top-12 right-3 bg-white rounded-2xl shadow-2xl border border-[#E5E5EA] z-30 overflow-hidden min-w-[140px]"
                          >
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                onEditPalace(palace.id);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-[#F5F5F7] transition-colors flex items-center gap-3"
                            >
                              <Edit2 size={16} className="text-[#007AFF]" />
                              <span className="text-[14px] font-medium text-[#000000]">
                                Edit
                              </span>
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                setShowDeleteConfirm(palace.id);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3"
                            >
                              <Trash2 size={16} className="text-red-600" />
                              <span className="text-[14px] font-medium text-red-600">
                                Delete
                              </span>
                            </motion.button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {sortedPalaces.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-6"
                >
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="text-xl font-bold text-[#000000] mb-2">
                    No palaces found
                  </h3>
                  <p className="text-[15px] text-[#86868B] text-center mb-6">
                    No palaces match the selected filters
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSortBy("Recent");
                    }}
                    className="px-6 py-3 bg-[#007AFF] text-white rounded-full font-semibold shadow-lg"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pb-[100px]"
            >
              {sortedPalaces.length > 0 ? (
                sortedPalaces.map((palace, index) => (
                  <motion.div
                    key={palace.id}
                    className="px-[20px] py-[16px] border-b border-[#E5E5EA] cursor-pointer hover:bg-[#F5F5F7] transition-colors active:bg-[#E5E5EA]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPalaceClick(palace.id)}
                  >
                  <div className="flex items-center gap-[16px] relative">
                    {/* Icon with gradient background */}
                    <div
                      className={`w-[72px] h-[72px] rounded-[16px] bg-gradient-to-br ${palace.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-[40px]">
                        {palace.icon}
                      </span>
                    </div>

                    {/* Menu Button - List View */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === palace.id ? null : palace.id);
                      }}
                      className="absolute top-0 right-0 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md"
                    >
                      <MoreVertical size={16} className="text-[#000000]" />
                    </motion.button>

                    {/* Menu Popup - List View */}
                    <AnimatePresence>
                      {activeMenuId === palace.id && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-20"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute top-10 right-0 bg-white rounded-2xl shadow-2xl border border-[#E5E5EA] z-30 overflow-hidden min-w-[140px]"
                          >
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                onEditPalace(palace.id);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-[#F5F5F7] transition-colors flex items-center gap-3"
                            >
                              <Edit2 size={16} className="text-[#007AFF]" />
                              <span className="text-[14px] font-medium text-[#000000]">
                                Edit
                              </span>
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                setShowDeleteConfirm(palace.id);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3"
                            >
                              <Trash2 size={16} className="text-red-600" />
                              <span className="text-[14px] font-medium text-red-600">
                                Delete
                              </span>
                            </motion.button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-[8px] mb-[4px]">
                        <h3 className="text-[17px] font-semibold text-[#000000] line-clamp-1">
                          {palace.name}
                        </h3>
                        {palace.progress === 100 && (
                          <Star
                            size={16}
                            className="text-yellow-400 fill-yellow-400 flex-shrink-0"
                          />
                        )}
                      </div>

                      <p className="text-[14px] text-[#86868B] mb-[8px] line-clamp-1">
                        {palace.description}
                      </p>

                      <div className="flex items-center gap-[12px] mb-[8px]">
                        <span className="text-[13px] text-[#86868B]">
                          {palace.totalRooms} rooms
                        </span>
                        <span className="text-[13px] text-[#86868B]">
                          •
                        </span>
                        <span className="inline-block px-[8px] py-[2px] bg-[#F5F5F7] rounded-full text-[11px] text-[#86868B] font-medium">
                          {palace.category}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-[8px]">
                        <div className="flex-1 h-[4px] bg-[#F5F5F7] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#007AFF] rounded-full"
                            style={{
                              width: `${palace.progress}%`,
                            }}
                          />
                        </div>
                        <span className="text-[13px] font-medium text-[#007AFF] min-w-[40px] text-right">
                          {palace.progress}%
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight
                      size={20}
                      className="text-[#C7C7CC] flex-shrink-0"
                    />
                  </div>
                </motion.div>
              ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-6"
                >
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="text-xl font-bold text-[#000000] mb-2">
                    No palaces found
                  </h3>
                  <p className="text-[15px] text-[#86868B] text-center mb-6">
                    No palaces match the selected filters
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSortBy("Recent");
                    }}
                    className="px-6 py-3 bg-[#007AFF] text-white rounded-full font-semibold shadow-lg"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowDeleteConfirm(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-[#000000] mb-2">
                  Delete Palace?
                </h3>
                <p className="text-[15px] text-[#86868B]">
                  This action cannot be undone. All floors, rooms, and progress will be permanently deleted.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-4 bg-[#F5F5F7] rounded-2xl font-semibold text-[#000000]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onDeletePalace(showDeleteConfirm);
                    setShowDeleteConfirm(null);
                  }}
                  className="flex-1 py-4 bg-red-600 rounded-2xl font-semibold text-white"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}