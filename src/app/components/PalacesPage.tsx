import {useMemo, useState} from "react";
import {motion} from "motion/react";
import {useCollapsibleHeader} from "../hooks/useCollapsibleHeader";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  ChevronRight,
  Folder as FolderIcon,
  FolderPlus,
  Grid,
  List,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import {DynamicBackground} from "./DynamicBackground";
import {AmbientParticles} from "./AmbientParticles";
import {Folder, Palace} from "../hooks/useProgressState";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import {Tabs, TabsList, TabsTrigger} from "./ui/tabs";
import {KeyboardSheet} from "./ui/KeyboardSheet";
import {Input} from "./ui/input";

const FOLDER_COLORS = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-red-500",
    "from-indigo-500 to-violet-500",
];

/**
 * Per-palace action menu. One source of truth for grid and list so the two
 * never drift. Switches to a restore/delete-only set for archived palaces.
 */
function PalaceActionsMenu({
                               triggerClassName,
                               palace,
                               hasFolders,
                               onToggleFavorite,
                               onMoveToFolder,
                               onArchiveToggle,
                               onDelete,
                           }: {
    triggerClassName: string;
    palace: Palace;
    hasFolders: boolean;
    onToggleFavorite: () => void;
    onMoveToFolder: () => void;
    onArchiveToggle: () => void;
    onDelete: () => void;
}) {
    const archived = !!palace.archived;
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
            <DropdownMenuContent align="end" className="w-[190px] rounded-[16px] p-1.5">
                {!archived && (
                    <>
                        <DropdownMenuItem
                            onClick={onToggleFavorite}
                            className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3"
                        >
                            <Star
                                size={16}
                                className={
                                    palace.favorite
                                        ? "text-[#FFC71E] fill-[#FFC71E]"
                                        : "text-[#091A7A]"
                                }
                            />
                            <span className="text-[14px] font-medium text-[#2C2C2C]">
                                {palace.favorite ? "Unfavorite" : "Favorite"}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={onMoveToFolder}
                            className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3"
                        >
                            <FolderIcon size={16} className="text-[#091A7A]"/>
                            <span className="text-[14px] font-medium text-[#2C2C2C]">
                                {hasFolders ? "Move to folder" : "Add to folder"}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                    </>
                )}
                <DropdownMenuItem
                    onClick={onArchiveToggle}
                    className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3"
                >
                    {archived ? (
                        <>
                            <ArchiveRestore size={16} className="text-[#091A7A]"/>
                            <span className="text-[14px] font-medium text-[#2C2C2C]">Restore</span>
                        </>
                    ) : (
                        <>
                            <Archive size={16} className="text-[#091A7A]"/>
                            <span className="text-[14px] font-medium text-[#2C2C2C]">Archive</span>
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onDelete}
                    className="rounded-[10px] px-3 py-2.5 hover:bg-red-50 focus:bg-red-50 cursor-pointer flex items-center gap-3"
                >
                    <Trash2 size={16} className="text-red-600"/>
                    <span className="text-[14px] font-medium text-red-600">Delete palace</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface PalacesPageProps {
    palaces: Palace[];
    folders: Folder[];
    onSearch: () => void;
    onPalaceClick: (palaceId: string) => void;
    onCreatePalace: () => void;
    onDeletePalace: (palaceId: string) => void;
    onToggleFavorite: (palaceId: string) => void;
    onToggleArchive: (palaceId: string) => void;
    onSetPalaceFolder: (palaceId: string, folderId: string | null) => void;
    onCreateFolder: (data: {name: string; color: string; icon: string}) => void;
    onDeleteFolder: (folderId: string) => void;
    /** Render skeletons instead of content while palaces resolve. */
    loading?: boolean;
}

// Pseudo-folder ids for the filter rail.
const ALL = "__all__";
const FAVORITES = "__favorites__";
const UNFILED = "__unfiled__";
const ARCHIVED = "__archived__";

export function PalacesPage({
                                palaces,
                                folders,
                                onSearch,
                                onPalaceClick,
                                onCreatePalace,
                                onDeletePalace,
                                onToggleFavorite,
                                onToggleArchive,
                                onSetPalaceFolder,
                                onCreateFolder,
                                onDeleteFolder,
                                loading = false,
                            }: PalacesPageProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeFilter, setActiveFilter] = useState<string>(ALL);
    const [sortBy, setSortBy] = useState("Recent");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [movingPalaceId, setMovingPalaceId] = useState<string | null>(null);
    const [showNewFolder, setShowNewFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

    // Scroll-away header: the navy hero recedes and a compact bar fades in that
    // keeps Palaces + search + create pinned at the top.
    const header = useCollapsibleHeader({distance: 110});

    const safeFolders = folders ?? [];
    const archivedCount = palaces.filter((p) => p.archived).length;
    const favoriteCount = palaces.filter((p) => p.favorite && !p.archived).length;

    const sortOptions = ["Recent", "Progress", "Name", "Category"];

    // Filter rail: pseudo-folders + real folders. Counts exclude archived,
    // except the Archived chip itself.
    const activeNonArchived = palaces.filter((p) => !p.archived);
    const rail = useMemo(() => {
        const base = [
            {id: ALL, label: "All", count: activeNonArchived.length},
            ...(favoriteCount > 0
                ? [{id: FAVORITES, label: "Favorites", count: favoriteCount}]
                : []),
            ...safeFolders.map((f) => ({
                id: f.id,
                label: f.name,
                count: activeNonArchived.filter((p) => p.folderId === f.id).length,
                folder: f,
            })),
        ];
        const unfiledCount = activeNonArchived.filter(
            (p) => !p.folderId,
        ).length;
        if (safeFolders.length > 0 && unfiledCount > 0) {
            base.push({id: UNFILED, label: "Unfiled", count: unfiledCount});
        }
        return base;
    }, [activeNonArchived, favoriteCount, safeFolders]);

    const visiblePalaces = useMemo(() => {
        let list = palaces.filter((p) =>
            activeFilter === ARCHIVED ? p.archived : !p.archived,
        );
        if (activeFilter === FAVORITES) list = list.filter((p) => p.favorite);
        else if (activeFilter === UNFILED) list = list.filter((p) => !p.folderId);
        else if (
            activeFilter !== ALL &&
            activeFilter !== ARCHIVED
        )
            list = list.filter((p) => p.folderId === activeFilter);

        return [...list].sort((a, b) => {
            // Favorites always float up (except in plain sorts that override).
            if (sortBy === "Recent" && !!a.favorite !== !!b.favorite)
                return a.favorite ? -1 : 1;
            switch (sortBy) {
                case "Progress":
                    return b.progress - a.progress;
                case "Name":
                    return a.name.localeCompare(b.name);
                case "Category":
                    return a.category.localeCompare(b.category);
                default:
                    return (
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    );
            }
        });
    }, [palaces, activeFilter, sortBy]);

    const palaceToDelete = palaces.find((p) => p.id === showDeleteConfirm);
    const movingPalace = palaces.find((p) => p.id === movingPalaceId);
    const deletingFolder = safeFolders.find((f) => f.id === folderToDelete);
    const isArchivedView = activeFilter === ARCHIVED;

    const menuProps = (palace: Palace) => ({
        palace,
        hasFolders: safeFolders.length > 0,
        onToggleFavorite: () => onToggleFavorite(palace.id),
        onMoveToFolder: () => setMovingPalaceId(palace.id),
        onArchiveToggle: () => onToggleArchive(palace.id),
        onDelete: () => setShowDeleteConfirm(palace.id),
    });

    const handleCreateFolder = () => {
        const name = newFolderName.trim();
        if (!name) return;
        onCreateFolder({
            name,
            color: FOLDER_COLORS[safeFolders.length % FOLDER_COLORS.length],
            icon: "📁",
        });
        setNewFolderName("");
        setShowNewFolder(false);
    };

    return (
        <div className="size-full flex flex-col relative">
            <DynamicBackground/>
            <AmbientParticles/>

            <div className="relative z-10 flex-1 flex flex-col min-h-0">
                {/* Compact sticky bar — fades in once the hero scrolls away */}
                <motion.div
                    style={{
                        opacity: header.compactOpacity,
                        pointerEvents: header.compactPointerEvents,
                    }}
                    className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#091A7A] to-[#1c2f9c] backdrop-blur-md shadow-[0_4px_24px_rgba(9,26,122,0.18)]"
                >
                    <div className="h-safe-top"/>
                    <div className="flex items-center justify-between px-[20px] py-2.5">
                        <h2 className="text-[18px] font-bold text-white">Palaces</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onSearch}
                                aria-label="Search palaces"
                                className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
                            >
                                <Search size={19} strokeWidth={2.5}/>
                            </button>
                            <button
                                onClick={onCreatePalace}
                                aria-label="Create palace"
                                className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
                            >
                                <Plus size={19} strokeWidth={2.5}/>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Scroll container holds the receding hero + content */}
                <div ref={header.ref} className="flex-1 overflow-y-auto scrollbar-hide">
                    {/* Hero header — recedes on scroll */}
                    <motion.div
                        style={{
                            opacity: header.largeOpacity,
                            scale: header.largeScale,
                            y: header.largeY,
                            pointerEvents: header.largePointerEvents,
                        }}
                        className="bg-gradient-to-b from-[#091A7A]/95 to-[#4F8EFF]/95 relative backdrop-blur-md origin-top will-change-transform"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]"/>

                        <div className="h-safe-top relative z-10"/>

                        <div className="px-[20px] pt-[16px] pb-[20px] relative z-10">
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
                                <DropdownMenuContent align="end" className="w-[180px] rounded-[16px] p-1.5">
                                    <p className="text-[12px] font-medium text-[#4b5563] px-3 py-2">Sort by</p>
                                    {sortOptions.map((option) => (
                                        <DropdownMenuItem
                                            key={option}
                                            onClick={() => setSortBy(option)}
                                            className={`rounded-[10px] px-3 py-2.5 cursor-pointer transition-all ${
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
                    </motion.div>

                    {/* Folder / collection rail */}
                    <div className="px-[20px] py-[14px] border-b border-[#E5E5EA] bg-white/95 backdrop-blur-md z-10 shadow-sm">
                        <div className="flex gap-[8px] overflow-x-auto scrollbar-hide pb-1">
                            {rail.map((chip) => {
                                const active = activeFilter === chip.id;
                                const isFav = chip.id === FAVORITES;
                                const isFolder = "folder" in chip;
                                return (
                                    <motion.button
                                        key={chip.id}
                                        onClick={() => setActiveFilter(chip.id)}
                                        whileTap={{scale: 0.96}}
                                        className={`flex-shrink-0 px-[16px] py-[10px] rounded-full transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40 ${
                                            active
                                                ? "bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white shadow-md"
                                                : "bg-white text-[#4b5563] border-2 border-[#E5E5EA]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isFav && (
                                                <Star
                                                    size={14}
                                                    className={
                                                        active
                                                            ? "text-white fill-white"
                                                            : "text-[#FFC71E] fill-[#FFC71E]"
                                                    }
                                                />
                                            )}
                                            {isFolder && (
                                                <FolderIcon
                                                    size={14}
                                                    className={active ? "text-white" : "text-[#3D8FEF]"}
                                                />
                                            )}
                                            <span className="text-[14px] font-semibold whitespace-nowrap">
                                                {chip.label}
                                            </span>
                                            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                                                active ? "bg-white/25 text-white" : "bg-[#F5F5F7] text-[#4b5563]"
                                            }`}>
                                                {chip.count}
                                            </span>
                                        </div>
                                    </motion.button>
                                );
                            })}

                            {/* New folder */}
                            <motion.button
                                onClick={() => setShowNewFolder(true)}
                                whileTap={{scale: 0.96}}
                                aria-label="New folder"
                                className="flex-shrink-0 px-[14px] py-[10px] rounded-full bg-[#EAF4FF] text-[#091A7A] flex items-center gap-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                            >
                                <FolderPlus size={15} strokeWidth={2.4}/>
                                <span className="text-[14px] font-semibold whitespace-nowrap">Folder</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Result count + folder actions */}
                    <div className="px-[20px] pt-[16px] pb-[10px] flex items-center justify-between">
                        <p className="text-[15px] font-medium text-[#2C2C2C]">
                            {isArchivedView ? "Archived" : visiblePalaces.length}{" "}
                            {isArchivedView
                                ? ""
                                : visiblePalaces.length === 1
                                    ? "Palace"
                                    : "Palaces"}
                        </p>
                        <div className="flex items-center gap-3">
                            {!isArchivedView && sortBy !== "Recent" && (
                                <p className="text-[13px] text-[#4b5563]">Sorted by {sortBy}</p>
                            )}
                            {safeFolders.some((f) => f.id === activeFilter) && (
                                <button
                                    onClick={() => setFolderToDelete(activeFilter)}
                                    className="text-[13px] font-medium text-red-500 hover:text-red-600"
                                >
                                    Delete folder
                                </button>
                            )}
                            {isArchivedView ? (
                                <button
                                    onClick={() => setActiveFilter(ALL)}
                                    className="flex items-center gap-1.5 text-[13px] font-semibold text-[#091A7A]"
                                >
                                    <ArrowLeft size={15}/>
                                    All palaces
                                </button>
                            ) : (
                                archivedCount > 0 && (
                                    <button
                                        onClick={() => setActiveFilter(ARCHIVED)}
                                        className="flex items-center gap-1.5 rounded-full bg-[#EAF4FF] px-3 py-1.5 text-[13px] font-semibold text-[#091A7A]"
                                    >
                                        <Archive size={14}/>
                                        Archived
                                        <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-white/70">
                                            {archivedCount}
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Grid View */}
                    {viewMode === "grid" && (
                        <div className="px-[20px] pb-[128px]">
                            <div className="grid grid-cols-2 gap-4">
                                {loading &&
                                    Array.from({length: 4}).map((_, i) => (
                                        <PalaceCardSkeleton key={`palace-skeleton-${i}`}/>
                                    ))}
                                {!loading && visiblePalaces.map((palace, index) => (
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
                                        className={`relative ${palace.archived ? "opacity-75" : ""}`}
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
                                                difficulty={
                                                    palace.totalRooms < 5
                                                        ? "Beginner"
                                                        : palace.totalRooms < 10
                                                            ? "Intermediate"
                                                            : "Advanced"
                                                }
                                                variant="compact"
                                                onClick={() => {
                                                }}
                                            />
                                        </div>

                                        {palace.favorite && !palace.archived && (
                                            <div className="absolute top-3 left-3 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md z-10">
                                                <Star size={14} className="text-[#FFC71E] fill-[#FFC71E]"/>
                                            </div>
                                        )}

                                        <PalaceActionsMenu
                                            triggerClassName="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg z-10 outline-none"
                                            {...menuProps(palace)}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {!loading && visiblePalaces.length === 0 && (
                                <PalacesEmptyState
                                    isArchivedView={isArchivedView}
                                    hasAnyPalaces={activeNonArchived.length > 0}
                                    onCreatePalace={onCreatePalace}
                                    onClear={() => setActiveFilter(ALL)}
                                />
                            )}
                        </div>
                    )}

                    {/* List View */}
                    {viewMode === "list" && (
                        <div className="pb-[128px]">
                            {visiblePalaces.length > 0 ? (
                                visiblePalaces.map((palace, index) => (
                                    <motion.div
                                        key={palace.id}
                                        className={`px-[20px] py-[16px] border-b border-[#E5E5EA] cursor-pointer hover:bg-[#F5F5F7] transition-colors active:bg-[#E5E5EA] ${
                                            palace.archived ? "opacity-75" : ""
                                        }`}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: index * 0.03}}
                                        whileTap={{scale: 0.98}}
                                        onClick={() => onPalaceClick(palace.id)}
                                    >
                                        <div className="flex items-center gap-[16px] relative">
                                            <div
                                                className={`w-[72px] h-[72px] rounded-[16px] bg-gradient-to-br ${palace.color} flex items-center justify-center flex-shrink-0`}
                                            >
                                                <span className="text-[40px]">{palace.icon}</span>
                                            </div>

                                            <PalaceActionsMenu
                                                triggerClassName="absolute top-0 right-0 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md outline-none"
                                                {...menuProps(palace)}
                                            />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-[8px] mb-[4px]">
                                                    {palace.favorite && !palace.archived && (
                                                        <Star
                                                            size={15}
                                                            className="text-[#FFC71E] fill-[#FFC71E] flex-shrink-0"
                                                        />
                                                    )}
                                                    <h3 className="text-[17px] font-semibold text-[#2C2C2C] line-clamp-1">
                                                        {palace.name}
                                                    </h3>
                                                </div>

                                                <p className="text-[14px] text-[#4b5563] mb-[8px] line-clamp-1">
                                                    {palace.description}
                                                </p>

                                                <div className="flex items-center gap-[12px] mb-[8px]">
                                                    <span className="text-[13px] text-[#4b5563]">
                                                        {palace.totalRooms} rooms
                                                    </span>
                                                    <span className="text-[13px] text-[#4b5563]">•</span>
                                                    <span className="inline-block px-[8px] py-[2px] bg-[#F5F5F7] rounded-full text-[11px] text-[#4b5563] font-medium">
                                                        {palace.category}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-[8px]">
                                                    <div className="flex-1 h-[4px] bg-[#F5F5F7] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#091A7A] rounded-full"
                                                            style={{width: `${palace.progress}%`}}
                                                        />
                                                    </div>
                                                    <span className="text-[13px] font-medium text-[#091A7A] min-w-[40px] text-right">
                                                        {palace.progress}%
                                                    </span>
                                                </div>
                                            </div>

                                            <ChevronRight size={20} className="text-[#C7C7CC] flex-shrink-0"/>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <PalacesEmptyState
                                    isArchivedView={isArchivedView}
                                    hasAnyPalaces={activeNonArchived.length > 0}
                                    onCreatePalace={onCreatePalace}
                                    onClear={() => setActiveFilter(ALL)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete palace */}
            <AlertDialog open={!!showDeleteConfirm} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
                <AlertDialogContent className="sm:max-w-[400px] rounded-3xl!">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} className="text-red-600"/>
                        </div>
                        <AlertDialogTitle className="text-center text-[#2C2C2C] text-xl">
                            {palaceToDelete ? `Delete “${palaceToDelete.name}”?` : "Delete palace?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[#4b5563]">
                            This can’t be undone. Every room, locus, question, and your training progress in this
                            palace are deleted for good.
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

            {/* Delete folder */}
            <AlertDialog open={!!folderToDelete} onOpenChange={(open) => !open && setFolderToDelete(null)}>
                <AlertDialogContent className="sm:max-w-[400px] rounded-3xl!">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 bg-[#EAF4FF] rounded-full flex items-center justify-center mx-auto mb-4">
                            <FolderIcon size={30} className="text-[#091A7A]"/>
                        </div>
                        <AlertDialogTitle className="text-center text-[#2C2C2C] text-xl">
                            {deletingFolder ? `Delete “${deletingFolder.name}”?` : "Delete folder?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[#4b5563]">
                            The folder is removed. Palaces inside it stay safe and move back to Unfiled.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-4">
                        <AlertDialogCancel
                            onClick={() => setFolderToDelete(null)}
                            className="flex-1 py-4 h-auto border-none bg-[#F5F5F7] hover:bg-gray-200 text-[#2C2C2C] font-semibold rounded-2xl"
                        >
                            Keep folder
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                if (folderToDelete) {
                                    onDeleteFolder(folderToDelete);
                                    if (activeFilter === folderToDelete) setActiveFilter(ALL);
                                    setFolderToDelete(null);
                                }
                            }}
                            className="flex-1 py-4 h-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl"
                        >
                            Delete folder
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* New folder — keyboard-docked sheet */}
            <KeyboardSheet
                open={showNewFolder}
                onClose={() => {
                    setShowNewFolder(false);
                    setNewFolderName("");
                }}
                title="New folder"
                footer={
                    <button
                        onClick={handleCreateFolder}
                        disabled={!newFolderName.trim()}
                        className={`w-full py-3.5 rounded-2xl font-semibold transition-colors ${
                            newFolderName.trim()
                                ? "bg-[#091A7A] text-white shadow-[0_8px_20px_rgba(9,26,122,0.25)] active:scale-[0.98]"
                                : "bg-[#E2E8F0] text-[#94a3b8] cursor-not-allowed"
                        }`}
                    >
                        Create folder
                    </button>
                }
            >
                <p className="text-[14px] text-[#475569]">
                    Group related palaces, like “Languages” or “Med school”.
                </p>
                <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateFolder();
                    }}
                    placeholder="Folder name"
                    enterKeyHint="done"
                    className="w-full bg-[#F4F8FF] rounded-xl px-4 h-12 text-[15px] text-[#091A7A] placeholder:text-[#091A7A]/40 border-2 border-transparent focus:border-[#4F8EFF]/60 outline-none"
                />
            </KeyboardSheet>

            {/* Move to folder — bottom sheet */}
            <KeyboardSheet
                open={!!movingPalaceId}
                onClose={() => setMovingPalaceId(null)}
                title="Move to folder"
                footer={
                    <button
                        onClick={() => {
                            setMovingPalaceId(null);
                            setShowNewFolder(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#EAF4FF] text-[#091A7A] font-semibold active:scale-[0.98] transition-transform"
                    >
                        <FolderPlus size={17}/>
                        New folder
                    </button>
                }
            >
                {movingPalace && (
                    <p className="text-[14px] text-[#475569] line-clamp-1">
                        {movingPalace.name}
                    </p>
                )}
                <div className="space-y-1.5">
                    <FolderOption
                        label="None (Unfiled)"
                        icon={<Sparkles size={16} className="text-[#94a3b8]"/>}
                        selected={!movingPalace?.folderId}
                        onClick={() => {
                            if (movingPalaceId) onSetPalaceFolder(movingPalaceId, null);
                            setMovingPalaceId(null);
                        }}
                    />
                    {safeFolders.map((f) => (
                        <FolderOption
                            key={f.id}
                            label={f.name}
                            icon={<FolderIcon size={16} className="text-[#3D8FEF]"/>}
                            selected={movingPalace?.folderId === f.id}
                            onClick={() => {
                                if (movingPalaceId) onSetPalaceFolder(movingPalaceId, f.id);
                                setMovingPalaceId(null);
                            }}
                        />
                    ))}
                </div>
            </KeyboardSheet>
        </div>
    );
}

function FolderOption({
                          label,
                          icon,
                          selected,
                          onClick,
                      }: {
    label: string;
    icon: React.ReactNode;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-colors ${
                selected ? "bg-[#091A7A] text-white" : "bg-[#F4F8FF] text-[#091A7A] hover:bg-[#EAF4FF]"
            }`}
        >
            <span className={selected ? "opacity-90" : ""}>{icon}</span>
            <span className="flex-1 text-[15px] font-medium line-clamp-1">{label}</span>
            {selected && (
                <span className="w-2.5 h-2.5 rounded-full bg-white"/>
            )}
        </button>
    );
}

function PalacesEmptyState({
                               isArchivedView,
                               hasAnyPalaces,
                               onCreatePalace,
                               onClear,
                           }: {
    isArchivedView: boolean;
    hasAnyPalaces: boolean;
    onCreatePalace: () => void;
    onClear: () => void;
}) {
    if (isArchivedView) {
        return (
            <EmptyState
                icon={<Archive className="w-7 h-7"/>}
                title="Nothing archived"
                description="Archived palaces land here so your main list stays focused. Archive one from its menu to tuck it away."
            />
        );
    }
    if (!hasAnyPalaces) {
        return (
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
        );
    }
    return (
        <EmptyState
            emoji="🔍"
            title="No palaces here"
            description="This collection is empty. Move a palace into it from the palace menu, or pick another collection."
            action={
                <button
                    onClick={onClear}
                    className="rounded-full bg-[#091A7A] px-5 py-3 text-sm font-medium text-white shadow-interactive"
                >
                    Show all palaces
                </button>
            }
        />
    );
}
