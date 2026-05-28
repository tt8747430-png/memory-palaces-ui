import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Folder,
  CheckCircle,
} from "lucide-react";
import { StatusBar } from "../ui/StatusBar";
import { DynamicBackground } from "../DynamicBackground";
import { AmbientParticles } from "../AmbientParticles";
import { useProgressState, Palace } from "../../hooks/useProgressState";

interface PalaceManagementScreenProps {
  onBack: () => void;
  onCreatePalace: () => void;
  onEditPalace: (palaceId: string) => void;
  onManageRooms: (palaceId: string) => void;
}

export function PalaceManagementScreen({
  onBack,
  onCreatePalace,
  onEditPalace,
  onManageRooms,
}: PalaceManagementScreenProps) {
  const { state, actions } = useProgressState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [expandedPalaceId, setExpandedPalaceId] = useState<string | null>(null);

  const categories = ["All", ...new Set(state.palaces.map((p) => p.category))];

  const filteredPalaces = state.palaces.filter((palace) => {
    const matchesSearch =
      palace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      palace.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || palace.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (palaceId: string) => {
    actions.deletePalace(palaceId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="size-full flex flex-col relative">
      <DynamicBackground />
      <AmbientParticles />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="bg-gradient-to-b from-[#091A7A]/95 to-[#4F8EFF]/95 relative flex-shrink-0 backdrop-blur-md">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]" />

          <div className="relative z-10">
            <StatusBar textColor="white" />
          </div>

          <div className="px-6 pt-3 pb-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>

              <h1 className="text-[28px] font-bold text-white">Manage Palaces</h1>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreatePalace}
                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
              >
                <Plus className="w-6 h-6 text-white" />
              </motion.button>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search palaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none text-[15px]"
                />
                <Filter className="w-5 h-5 text-white/60" />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full transition-all text-[14px] font-semibold ${
                    selectedCategory === category
                      ? "bg-white text-[#007AFF]"
                      : "bg-white/15 text-white"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-6 pb-24">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[15px] font-medium text-[#000000]">
              {filteredPalaces.length} {filteredPalaces.length === 1 ? "Palace" : "Palaces"}
            </p>
            <p className="text-[13px] text-[#86868B]">
              Total: {state.palaces.length}
            </p>
          </div>

          <div className="space-y-4">
            {filteredPalaces.map((palace, index) => (
              <motion.div
                key={palace.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-card border border-white/60"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${palace.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-[32px]">{palace.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-[17px] font-semibold text-[#000000] mb-1">
                            {palace.name}
                          </h3>
                          <p className="text-[14px] text-[#86868B] line-clamp-2">
                            {palace.description}
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            setExpandedPalaceId(
                              expandedPalaceId === palace.id ? null : palace.id
                            )
                          }
                          className="w-9 h-9 bg-[#F5F5F7] rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <MoreVertical size={18} className="text-[#86868B]" />
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-[#F5F5F7] rounded-full text-[11px] text-[#86868B] font-medium">
                          {palace.category}
                        </span>
                        <span className="text-[13px] text-[#86868B]">
                          {palace.totalRooms} rooms
                        </span>
                        {palace.progress === 100 && (
                          <div className="flex items-center gap-1">
                            <CheckCircle size={14} className="text-green-600" />
                            <span className="text-[11px] text-green-600 font-medium">
                              Complete
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${palace.progress}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#007AFF] to-[#0051D5] rounded-full"
                          />
                        </div>
                        <span className="text-[13px] font-semibold text-[#007AFF] min-w-[45px] text-right">
                          {palace.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedPalaceId === palace.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-[#E5E5EA] grid grid-cols-3 gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onManageRooms(palace.id)}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F5F5F7] rounded-2xl"
                          >
                            <Folder size={20} className="text-[#007AFF]" />
                            <span className="text-[12px] font-medium text-[#000000]">
                              Rooms
                            </span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onEditPalace(palace.id)}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F5F5F7] rounded-2xl"
                          >
                            <Edit2 size={20} className="text-[#007AFF]" />
                            <span className="text-[12px] font-medium text-[#000000]">
                              Edit
                            </span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowDeleteConfirm(palace.id)}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-red-50 rounded-2xl"
                          >
                            <Trash2 size={20} className="text-red-600" />
                            <span className="text-[12px] font-medium text-red-600">
                              Delete
                            </span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}

            {filteredPalaces.length === 0 && (
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
                  {searchQuery
                    ? "No palaces match your search"
                    : "Create your first memory palace to get started"}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCreatePalace}
                  className="px-6 py-3 bg-[#007AFF] text-white rounded-full font-semibold shadow-lg flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create Palace
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 z-50"
              onClick={() => setShowDeleteConfirm(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-[#000000] mb-2">
                  Delete Palace?
                </h3>
                <p className="text-[15px] text-[#86868B]">
                  This action cannot be undone. All rooms and progress will be permanently
                  deleted.
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
                  onClick={() => handleDelete(showDeleteConfirm)}
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
