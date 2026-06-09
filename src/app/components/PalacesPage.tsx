import {useState} from "react";
import {motion} from "motion/react";
import {
  ChevronRight,
  Edit2,
  Grid,
  List,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import {StatusBar} from "./ui";
import {DynamicBackground} from "./DynamicBackground";
import {AmbientParticles} from "./AmbientParticles";
import {Palace} from "../hooks/useProgressState";
import {PalaceCard} from "./cards/PalaceCard";
import {PalaceCardSkeleton} from "./cards/PalaceCardSkeleton";
import {EmptyState} from "./ui/EmptyState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "./ui/alert-dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "./ui/dropdown-menu";
import {Tabs, TabsList, TabsTrigger} from "./ui/tabs";

/**
 * Per-palace edit/delete menu. Shared by the grid and list views so the two
 * never drift; only the trigger's position/elevation differs per view.
 */
function PalaceActionsMenu({
                               triggerClassName,
                               onEdit,
                               onDelete,
                           }: {
    triggerClassName: string;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <motion.button
                        whileTap={{scale: 0.9}}
                        aria-label="Palace options"
                        onClick={(e) => e.stopPropagation()}
                        className={`${triggerClassName} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40`}
                    >
                        <MoreVertical size={16} className="text-[#2C2C2C]"/>
                    </motion.button>
                }
            />
            <DropdownMenuContent align="end" className="w-[160px] rounded-[16px] p-1.5">
                <DropdownMenuItem
                    onClick={onEdit}
                    className="rounded-[10px] px-3 py-2 cursor-pointer flex items-center gap-3"
                >
                    <Edit2 size={16} className="text-[#091A7A]"/>
                    <span className="text-[14px] font-medium text-[#2C2C2C]">Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onDelete}
                    className="rounded-[10px] px-3 py-2 cursor-pointer flex items-center gap-3"
                >
                    <Trash2 size={16} className="text-red-600"/>
                    <span className="text-[14px] font-medium text-red-600">Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface PalacesPageProps {
    palaces: Palace[];
    onSearch: () => void;
    onPalaceClick: (palaceId: string) => void;
    onCreatePalace: () => void;
    onEditPalace: (palaceId: string) => void;
    onDeletePalace: (palaceId: string) => void;
    /** Render skeletons instead of content while palaces resolve. */
    loading?: boolean;
}

export function PalacesPage({
                                palaces,
                                onSearch,
                                onPalaceClick,
                                onCreatePalace,
                                onEditPalace,
                                onDeletePalace,
                                loading = false,
                            }: PalacesPageProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">(
        "grid",
    );
    const [selectedCategory, setSelectedCategory] =
        useState("All");
    const [sortBy, setSortBy] = useState("Recent");
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

    const palaceToDelete = palaces.find((p) => p.id === showDeleteConfirm);

    return (
        <div className="size-full flex flex-col relative">
            {/* Dynamic Background */}
            <DynamicBackground/>

            {/* Ambient Particles */}
            <AmbientParticles/>

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col">
                {/* Header */}
                <div
                    className="bg-gradient-to-b from-[#091A7A]/95 to-[#4F8EFF]/95 relative flex-shrink-0 backdrop-blur-md">
                    <div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]"/>

                    {/* Status Bar */}
                    <div className="relative z-10">
                        <StatusBar textColor="white"/>
                    </div>

                    {/* Header Content */}
                    <div className="px-[20px] pt-[12px] pb-[20px] relative z-10">
                        <div className="flex items-center justify-between mb-[16px]">
                            <h1 className="text-[32px] font-bold text-white">
                                Palaces
                            </h1>
                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileTap={{scale: 0.92}}
                                    onClick={onSearch}
                                    aria-label="Search palaces"
                                    className="w-[44px] h-[44px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                                >
                                    <Search size={20} strokeWidth={2.5}/>
                                </motion.button>
                                <motion.button
                                    whileTap={{scale: 0.92}}
                                    onClick={onCreatePalace}
                                    aria-label="Create palace"
                                    className="w-[44px] h-[44px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                                >
                                    <Plus size={20} strokeWidth={2.5}/>
                                </motion.button>
                            </div>
                        </div>

                        {/* View Controls */}
                        <div className="flex items-center gap-[12px]">
                            <div className="flex-1">
                                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}
                                      className="w-full">
                                    <TabsList
                                        className="grid w-full grid-cols-2 bg-white/15 backdrop-blur-md rounded-[16px] p-1 h-11 group-data-horizontal/tabs:h-11">
                                        <TabsTrigger value="grid"
                                                     className="rounded-[12px] text-[14px] font-medium text-white/80 hover:text-white data-active:bg-white/90 data-active:text-[#091A7A]">
                                            <Grid size={18} strokeWidth={2.5}/>
                                            Grid
                                        </TabsTrigger>
                                        <TabsTrigger value="list"
                                                     className="rounded-[12px] text-[14px] font-medium text-white/80 hover:text-white data-active:bg-white/90 data-active:text-[#091A7A]">
                                            <List size={18} strokeWidth={2.5}/>
                                            List
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <motion.button
                                            whileTap={{scale: 0.92}}
                                            aria-label="Sort palaces"
                                            className="w-[44px] h-[44px] rounded-[16px] bg-white/15 backdrop-blur-md flex items-center justify-center text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                                            <SlidersHorizontal size={20} strokeWidth={2.5}/>
                                        </motion.button>
                                    }
                                />
                                <DropdownMenuContent align="end" className="w-[180px] rounded-[20px] p-2">
                                    <p className="text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider px-2 py-2">
                                        Sort By
                                    </p>
                                    {sortOptions.map((option) => (
                                        <DropdownMenuItem
                                            key={option}
                                            onClick={() => setSortBy(option)}
                                            className={`rounded-[12px] px-3 py-2 cursor-pointer transition-all ${
                                                sortBy === option ? "bg-[#091A7A]/10 text-[#091A7A]" : ""
                                            }`}
                                        >
                                            <span className="flex-1 font-medium">{option}</span>
                                            {sortBy === option && (
                                                <div className="w-2 h-2 rounded-full bg-[#091A7A]"/>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>


                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {/* Category Filter */}
                    <div
                        className="px-[20px] py-[16px] border-b border-[#E5E5EA] sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm">
                        <div className="flex gap-[8px] overflow-x-auto scrollbar-hide pb-1">
                            {categories.map((category, index) => {
                                const count = category === "All"
                                    ? palaces.length
                                    : palaces.filter(p => p.category === category).length;

                                return (
                                    <motion.button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: index * 0.05}}
                                        whileTap={{scale: 0.96}}
                                        className={`flex-shrink-0 px-[18px] py-[10px] rounded-full transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40 ${
                                            selectedCategory === category
                                                ? "bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white shadow-md"
                                                : "bg-white text-[#4b5563] border-2 border-[#E5E5EA]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold">
                        {category}
                      </span>
                                            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                                                selectedCategory === category
                                                    ? "bg-white/25 text-white"
                                                    : "bg-[#F5F5F7] text-[#4b5563]"
                                            }`}>
                        {count}
                      </span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Result count + active sort */}
                    <div className="px-[20px] pt-[16px] pb-[10px] flex items-baseline justify-between">
                        <p className="text-[15px] font-medium text-[#2C2C2C]">
                            {sortedPalaces.length}{" "}
                            {sortedPalaces.length === 1 ? "Palace" : "Palaces"}
                        </p>
                        {sortBy !== "Recent" && (
                            <p className="text-[13px] text-[#4b5563]">
                                Sorted by {sortBy}
                            </p>
                        )}
                    </div>

                    {/* Grid View */}
                    {viewMode === "grid" && (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="px-[20px] pb-[128px]"
                        >
                            {/* Palace Cards Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {loading &&
                                    Array.from({length: 4}).map((_, i) => (
                                        <PalaceCardSkeleton
                                            key={`palace-skeleton-${i}`}
                                        />
                                    ))}
                                {!loading && sortedPalaces.map((palace, index) => (
                                    <motion.div
                                        key={palace.id}
                                        initial={{opacity: 0, scale: 0.9, y: 20}}
                                        animate={{opacity: 1, scale: 1, y: 0}}
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
                                                onClick={() => {
                                                }}
                                            />
                                        </div>

                                        {/* Menu (portaled so it can't clip in the scroll area) */}
                                        <PalaceActionsMenu
                                            triggerClassName="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg z-10 outline-none"
                                            onEdit={() => onEditPalace(palace.id)}
                                            onDelete={() => setShowDeleteConfirm(palace.id)}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {!loading && sortedPalaces.length === 0 && (
                                palaces.length === 0 ? (
                                    <EmptyState
                                        emoji="🏛️"
                                        title="Build your first palace"
                                        description="A memory palace is a familiar place you fill with what you want to remember. Create one to start training."
                                        action={
                                            <button
                                                onClick={onCreatePalace}
                                                className="inline-flex items-center gap-2 rounded-full bg-[#091A7A] px-5 py-3 text-sm font-medium text-white shadow-interactive"
                                            >
                                                <Plus className="h-4 w-4"/>
                                                Create palace
                                            </button>
                                        }
                                    />
                                ) : (
                                    <EmptyState
                                        emoji="🔍"
                                        title="No palaces match"
                                        description="Nothing fits the selected filters. Try another category or clear your filters."
                                        action={
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory("All");
                                                    setSortBy("Recent");
                                                }}
                                                className="rounded-full bg-[#091A7A] px-5 py-3 text-sm font-medium text-white shadow-interactive"
                                            >
                                                Clear filters
                                            </button>
                                        }
                                    />
                                )
                            )}
                        </motion.div>
                    )}

                    {/* List View */}
                    {viewMode === "list" && (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="pb-[128px]"
                        >
                            {sortedPalaces.length > 0 ? (
                                sortedPalaces.map((palace, index) => (
                                    <motion.div
                                        key={palace.id}
                                        className="px-[20px] py-[16px] border-b border-[#E5E5EA] cursor-pointer hover:bg-[#F5F5F7] transition-colors active:bg-[#E5E5EA]"
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: index * 0.03}}
                                        whileTap={{scale: 0.98}}
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

                                            {/* Menu - List View (portaled so it can't clip in the scroll area) */}
                                            <PalaceActionsMenu
                                                triggerClassName="absolute top-0 right-0 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md outline-none"
                                                onEdit={() => onEditPalace(palace.id)}
                                                onDelete={() => setShowDeleteConfirm(palace.id)}
                                            />

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-[8px] mb-[4px]">
                                                    <h3 className="text-[17px] font-semibold text-[#2C2C2C] line-clamp-1">
                                                        {palace.name}
                                                    </h3>
                                                    {palace.progress === 100 && (
                                                        <Star
                                                            size={16}
                                                            className="text-[#FFC71E] fill-[#FFC71E] flex-shrink-0"
                                                        />
                                                    )}
                                                </div>

                                                <p className="text-[14px] text-[#4b5563] mb-[8px] line-clamp-1">
                                                    {palace.description}
                                                </p>

                                                <div className="flex items-center gap-[12px] mb-[8px]">
                        <span className="text-[13px] text-[#4b5563]">
                          {palace.totalRooms} rooms
                        </span>
                                                    <span className="text-[13px] text-[#4b5563]">
                          •
                        </span>
                                                    <span
                                                        className="inline-block px-[8px] py-[2px] bg-[#F5F5F7] rounded-full text-[11px] text-[#4b5563] font-medium">
                          {palace.category}
                        </span>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="flex items-center gap-[8px]">
                                                    <div
                                                        className="flex-1 h-[4px] bg-[#F5F5F7] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#091A7A] rounded-full"
                                                            style={{
                                                                width: `${palace.progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span
                                                        className="text-[13px] font-medium text-[#091A7A] min-w-[40px] text-right">
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
                            ) : palaces.length === 0 ? (
                                <EmptyState
                                    emoji="🏛️"
                                    title="Build your first palace"
                                    description="A memory palace is a familiar place you fill with what you want to remember. Create one to start training."
                                    action={
                                        <button
                                            onClick={onCreatePalace}
                                            className="inline-flex items-center gap-2 rounded-full bg-[#091A7A] px-5 py-3 text-sm font-medium text-white shadow-interactive"
                                        >
                                            <Plus className="h-4 w-4"/>
                                            Create palace
                                        </button>
                                    }
                                />
                            ) : (
                                <EmptyState
                                    emoji="🔍"
                                    title="No palaces match"
                                    description="Nothing fits the selected filters. Try another category or clear your filters."
                                    action={
                                        <button
                                            onClick={() => {
                                                setSelectedCategory("All");
                                                setSortBy("Recent");
                                            }}
                                            className="rounded-full bg-[#091A7A] px-5 py-3 text-sm font-medium text-white shadow-interactive"
                                        >
                                            Clear filters
                                        </button>
                                    }
                                />
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            <AlertDialog open={!!showDeleteConfirm} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
                <AlertDialogContent className="sm:max-w-[400px] rounded-3xl!">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} className="text-red-600"/>
                        </div>
                        <AlertDialogTitle className="text-center text-[#2C2C2C] text-xl">
                            {palaceToDelete
                                ? `Delete “${palaceToDelete.name}”?`
                                : "Delete palace?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[#4b5563]">
                            This can’t be undone. Every floor, room, and your training progress in this palace are
                            deleted for good.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-4">
                        <AlertDialogCancel
                            onClick={() => setShowDeleteConfirm(null)}
                            className="flex-1 py-4 h-auto border-none bg-[#F5F5F7] hover:bg-gray-200 text-[#2C2C2C] font-semibold rounded-2xl"
                        >
                            Keep palace
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                if (showDeleteConfirm) {
                                    onDeletePalace(showDeleteConfirm);
                                    setShowDeleteConfirm(null);
                                }
                            }}
                            className="flex-1 py-4 h-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl"
                        >
                            Delete palace
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}