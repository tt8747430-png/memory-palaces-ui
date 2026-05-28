import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Play,
  Clock,
  Star,
  Lock,
  ChevronRight,
  CheckCircle,
  Users,
  Brain,
  Zap,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  Save,
  X,
  Folder,
  Unlock,
} from "lucide-react";
import { useProgressState, Floor as StateFloor, Room as StateRoom } from "../../hooks/useProgressState";

interface PalaceDetailScreenProps {
  palaceId: string;
  onBack: () => void;
  onRoomClick?: (roomTitle: string) => void;
  onQuizClick?: () => void;
}

const guides = [
  {
    id: 1,
    name: "Dr. Memory Expert",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
  },
  {
    id: 2,
    name: "Prof. Mind Palace",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop",
  },
  {
    id: 3,
    name: "Memory Master",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=128&h=128&fit=crop",
  },
  {
    id: 4,
    name: "Dr. Recall Pro",
    avatar:
      "https://images.unsplash.com/photo-1614289371518-722f2615943d?w=128&h=128&fit=crop",
  },
];


const getCurrentRoom = (floors: StateFloor[]) => {
  for (const floor of floors) {
    for (const room of floor.rooms) {
      if (!room.isCompleted && room.isUnlocked) {
        return {
          floor: floor.title,
          room: room.title,
          progress: room.progress,
        };
      }
    }
  }

  if (floors.length > 0 && floors[0].rooms.length > 0) {
    return {
      floor: floors[0].title,
      room: floors[0].rooms[0].title,
      progress: floors[0].rooms[0].progress,
    };
  }

  return null;
};

export function PalaceDetailScreen({
  palaceId,
  onBack,
  onRoomClick,
  onQuizClick,
}: PalaceDetailScreenProps) {
  const { state, actions } = useProgressState();
  const [expandedFloors, setExpandedFloors] = useState<string[]>([]);
  const [editingFloorId, setEditingFloorId] = useState<string | null>(null);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [showAddFloor, setShowAddFloor] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState<string | null>(null);
  const [activeFloorMenu, setActiveFloorMenu] = useState<string | null>(null);
  const [activeRoomMenu, setActiveRoomMenu] = useState<string | null>(null);
  const [showDeleteFloorConfirm, setShowDeleteFloorConfirm] = useState<string | null>(null);
  const [showDeleteRoomConfirm, setShowDeleteRoomConfirm] = useState<{ floorId: string; roomId: string } | null>(null);

  const [floorFormData, setFloorFormData] = useState({ title: "", description: "" });
  const [roomFormData, setRoomFormData] = useState({
    title: "",
    description: "",
    duration: 10,
    content: "",
    isUnlocked: true,
  });

  const palace = state.palaces.find((p) => p.id === palaceId);
  const floors = palace?.floors || [];
  const currentRoom = floors.length > 0 ? getCurrentRoom(floors) : null;
  const totalProgress = Math.round(
    floors.reduce((sum, floor) => sum + floor.progress, 0) /
      floors.length,
  );
  const totalRooms = floors.reduce(
    (sum, floor) => sum + floor.rooms.length,
    0,
  );
  const totalDuration = floors.reduce(
    (sum, floor) => sum + floor.rooms.length * 12,
    0,
  );

  const toggleFloor = (floorId: string) => {
    setExpandedFloors((prev) =>
      prev.includes(floorId)
        ? prev.filter((id) => id !== floorId)
        : [...prev, floorId],
    );
  };

  const handleAddFloor = () => {
    if (!floorFormData.title.trim() || !floorFormData.description.trim()) return;

    actions.createFloor(palaceId, {
      title: floorFormData.title.trim(),
      description: floorFormData.description.trim(),
      order: floors.length + 1,
    });

    setFloorFormData({ title: "", description: "" });
    setShowAddFloor(false);
  };

  const handleEditFloor = (floor: StateFloor) => {
    setFloorFormData({ title: floor.title, description: floor.description });
    setEditingFloorId(floor.id);
  };

  const handleSaveFloor = (floorId: string) => {
    if (!floorFormData.title.trim() || !floorFormData.description.trim()) return;

    actions.updateFloor(palaceId, floorId, {
      title: floorFormData.title.trim(),
      description: floorFormData.description.trim(),
    });

    setEditingFloorId(null);
    setFloorFormData({ title: "", description: "" });
  };

  const handleDeleteFloor = (floorId: string) => {
    actions.deleteFloor(palaceId, floorId);
    setShowDeleteFloorConfirm(null);
  };

  const handleAddRoom = (floorId: string) => {
    if (!roomFormData.title.trim() || !roomFormData.description.trim() || !roomFormData.content.trim()) return;

    const floor = floors.find(f => f.id === floorId);
    if (!floor) return;

    actions.createRoom(palaceId, floorId, {
      title: roomFormData.title.trim(),
      description: roomFormData.description.trim(),
      duration: roomFormData.duration,
      content: roomFormData.content.trim(),
      isUnlocked: roomFormData.isUnlocked,
      isCompleted: false,
      progress: 0,
      order: floor.rooms.length + 1,
    });

    setRoomFormData({ title: "", description: "", duration: 10, content: "", isUnlocked: true });
    setShowAddRoom(null);
  };

  const handleEditRoom = (floorId: string, room: StateRoom) => {
    setRoomFormData({
      title: room.title,
      description: room.description,
      duration: room.duration,
      content: room.content,
      isUnlocked: room.isUnlocked,
    });
    setEditingRoomId(room.id);
  };

  const handleSaveRoom = (floorId: string, roomId: string) => {
    if (!roomFormData.title.trim() || !roomFormData.description.trim() || !roomFormData.content.trim()) return;

    actions.updateRoom(palaceId, floorId, roomId, {
      title: roomFormData.title.trim(),
      description: roomFormData.description.trim(),
      duration: roomFormData.duration,
      content: roomFormData.content.trim(),
      isUnlocked: roomFormData.isUnlocked,
    });

    setEditingRoomId(null);
    setRoomFormData({ title: "", description: "", duration: 10, content: "", isUnlocked: true });
  };

  const handleDeleteRoom = (floorId: string, roomId: string) => {
    actions.deleteRoom(palaceId, floorId, roomId);
    setShowDeleteRoomConfirm(null);
  };

  if (!palace) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-body text-[#6B7280]">
          Palace not found
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white overflow-y-auto">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ADC8FF]/30 via-transparent to-transparent" />

        <div className="relative px-6 pt-6 pb-6">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40"
            >
              <ArrowLeft className="w-5 h-5 text-[#091A7A]" />
            </motion.button>

            <h1 className="text-section-header text-[#091A7A]">
              Palace Details
            </h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddFloor(true)}
              className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40"
            >
              <Plus className="w-5 h-5 text-[#091A7A]" />
            </motion.button>
          </div>

          {/* Palace Banner Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 mb-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl">{palace.icon}</div>

              <div className="flex-1">
                <h1 className="text-main-heading text-[#091A7A] mb-2">
                  {palace.name}
                </h1>
                <p className="text-small text-[#6B7280] mb-3">
                  {palace.description}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-tiny text-[#6B7280]">
                      {Math.floor(totalDuration / 60)}h{" "}
                      {totalDuration % 60}min
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-tiny font-medium text-[#091A7A]">
                      4.9
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-subheading text-[#091A7A]">
                  Overall Progress
                </span>
                <span className="text-subheading font-semibold text-[#091A7A]">
                  {palace.progress}%
                </span>
              </div>

              <div className="h-3 bg-[#ADC8FF]/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${palace.progress}%` }}
                  transition={{
                    delay: 0.3,
                    duration: 1.2,
                    ease: "easeOut",
                  }}
                  className="h-full bg-gradient-to-r from-[#091A7A] to-[#1A2FB8] rounded-full shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-tiny text-[#6B7280]">
                  Palace Content
                </span>
                <span className="text-tiny text-[#6B7280]">
                  {palace.roomsCompleted}/{palace.totalRooms}{" "}
                  Rooms
                </span>
              </div>
            </div>
          </motion.div>

          {/* Guides Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-4 h-4 text-[#6B7280]" />
              <span className="text-small text-[#6B7280]">
                Memory Guides
              </span>
            </div>
            <div className="flex items-center">
              {guides.slice(0, 4).map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                  style={{
                    marginLeft: index > 0 ? "-12px" : "0",
                  }}
                >
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-11 h-11 rounded-full border-3 border-white shadow-lg object-cover"
                  />
                </motion.div>
              ))}
              <div
                className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-full border-3 border-white shadow-lg flex items-center justify-center"
                style={{ marginLeft: "-12px" }}
              >
                <span className="text-xs font-semibold text-[#091A7A]">
                  +2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Exploring Button */}
      {currentRoom && (
        <div className="px-6 mb-4">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRoomClick?.(currentRoom.room)}
            className="w-full bg-gradient-to-br from-[#ADC8FF]/90 to-[#ADC8FF]/70 backdrop-blur-lg text-[#091A7A] rounded-3xl p-5 shadow-xl border border-white/40"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white/30 rounded-xl flex items-center justify-center">
                    <Play className="w-4 h-4 text-[#091A7A]" />
                  </div>
                  <span className="text-subheading font-semibold">
                    Continue Exploring
                  </span>
                </div>
                <p className="text-small text-[#091A7A]/80 font-medium">
                  {currentRoom.floor}: {currentRoom.room}
                </p>
                <p className="text-small text-[#091A7A]/70 font-medium">
                  {currentRoom.progress}% completed
                </p>
              </div>
              <div className="w-14 h-14 bg-white backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                <Play className="w-6 h-6 text-[#091A7A]" />
              </div>
            </div>
          </motion.button>
        </div>
      )}

      {/* Test Your Knowledge Button */}
      <div className="px-6 mb-6">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onQuizClick}
          className="w-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white rounded-3xl p-5 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-subheading font-semibold">
                  Test Your Knowledge
                </span>
              </div>
              <p className="text-small text-white/80 font-medium">
                Quiz on palace content
              </p>
              <p className="text-small text-white/70 font-medium">
                Earn bonus XP for your mastery
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Floors & Rooms */}
      <div className="px-6 pb-6">
        {floors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-6"
          >
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-bold text-[#000000] mb-2">
              No floors yet
            </h3>
            <p className="text-[15px] text-[#86868B] text-center mb-6">
              This palace doesn't have any floors or rooms yet. Click the + button above to add your first floor.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {floors.map((floor, floorIndex) => {
            const isExpanded = expandedFloors.includes(
              floor.id,
            );
            const completedRooms = floor.rooms.filter((r) => r.isCompleted).length;
            const floorProgress = floor.rooms.length > 0
              ? Math.round((completedRooms / floor.rooms.length) * 100)
              : 0;

            return (
              <motion.div
                key={floor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: floorIndex * 0.1,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-elevated border border-white/60"
              >
                {/* Floor Header */}
                <div className="p-6">
                  {editingFloorId === floor.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={floorFormData.title}
                        onChange={(e) => setFloorFormData({ ...floorFormData, title: e.target.value })}
                        placeholder="Floor title"
                        className="w-full px-4 py-3 bg-white rounded-xl border-2 border-[#007AFF] text-[#000000] outline-none"
                      />
                      <textarea
                        value={floorFormData.description}
                        onChange={(e) => setFloorFormData({ ...floorFormData, description: e.target.value })}
                        placeholder="Floor description"
                        rows={2}
                        className="w-full px-4 py-3 bg-white rounded-xl border-2 border-[#007AFF] text-[#000000] outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSaveFloor(floor.id)}
                          className="flex-1 py-2 bg-[#007AFF] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                        >
                          <Save size={16} />
                          Save
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setEditingFloorId(null);
                            setFloorFormData({ title: "", description: "" });
                          }}
                          className="px-4 py-2 bg-[#F5F5F7] text-[#000000] rounded-xl font-semibold"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleFloor(floor.id)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-[#ADC8FF] rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                            <span className="text-small font-semibold text-[#091A7A]">
                              {floorIndex + 1}
                            </span>
                          </div>
                          <span className="text-body font-semibold text-[#091A7A]/80">
                            Floor {floorIndex + 1}
                          </span>
                        </div>
                        <h3 className="text-subheading text-[#091A7A] mb-2">
                          {floor.title}
                        </h3>
                        <p className="text-[13px] text-[#86868B] mb-3">
                          {floor.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="h-2.5 w-24 bg-[#ADC8FF]/30 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${floorProgress}%`,
                              }}
                              transition={{
                                delay: 0.5,
                                duration: 1,
                                ease: "easeOut",
                              }}
                              className="h-full bg-gradient-to-r from-[#091A7A] to-[#1A2FB8] rounded-full"
                            />
                          </div>
                          <span className="text-small font-semibold text-[#091A7A]">
                            {floorProgress}%
                          </span>
                          <span className="text-[13px] text-[#86868B]">
                            {floor.rooms.length} {floor.rooms.length === 1 ? 'room' : 'rooms'}
                          </span>
                        </div>
                      </motion.button>

                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                          className="w-10 h-10 bg-[#ADC8FF]/15 rounded-full flex items-center justify-center border border-white/40"
                        >
                          <ChevronRight className="w-5 h-5 text-[#091A7A]/70" />
                        </motion.div>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveFloorMenu(activeFloorMenu === floor.id ? null : floor.id);
                          }}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md relative"
                        >
                          <MoreVertical size={18} className="text-[#000000]" />
                        </motion.button>

                        <AnimatePresence>
                          {activeFloorMenu === floor.id && (
                            <>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveFloorMenu(null)}
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                className="absolute right-6 top-20 bg-white rounded-2xl shadow-2xl border border-[#E5E5EA] z-50 overflow-hidden min-w-[160px]"
                              >
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveFloorMenu(null);
                                    setShowAddRoom(floor.id);
                                    setExpandedFloors((prev) =>
                                      prev.includes(floor.id) ? prev : [...prev, floor.id]
                                    );
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-[#F5F5F7] transition-colors flex items-center gap-3"
                                >
                                  <Plus size={16} className="text-[#007AFF]" />
                                  <span className="text-[14px] font-medium text-[#000000]">
                                    Add Room
                                  </span>
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveFloorMenu(null);
                                    handleEditFloor(floor);
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-[#F5F5F7] transition-colors flex items-center gap-3"
                                >
                                  <Edit2 size={16} className="text-[#007AFF]" />
                                  <span className="text-[14px] font-medium text-[#000000]">
                                    Edit Floor
                                  </span>
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveFloorMenu(null);
                                    setShowDeleteFloorConfirm(floor.id);
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3"
                                >
                                  <Trash2 size={16} className="text-red-600" />
                                  <span className="text-[14px] font-medium text-red-600">
                                    Delete Floor
                                  </span>
                                </motion.button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floor Rooms */}
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? "auto" : 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#ADC8FF]/30 to-transparent mb-4" />

                    {showAddRoom === floor.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-[#007AFF]/30 space-y-4"
                      >
                        <h4 className="text-[15px] font-semibold text-[#000000] flex items-center gap-2">
                          <Plus size={18} className="text-[#007AFF]" />
                          Add New Room
                        </h4>
                        <input
                          type="text"
                          value={roomFormData.title}
                          onChange={(e) => setRoomFormData({ ...roomFormData, title: e.target.value })}
                          placeholder="Room title"
                          className="w-full px-4 py-3 bg-white rounded-xl border-2 border-[#E5E5EA] focus:border-[#007AFF] text-[#000000] outline-none"
                        />
                        <textarea
                          value={roomFormData.description}
                          onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                          placeholder="Room description"
                          rows={2}
                          className="w-full px-4 py-3 bg-white rounded-xl border-2 border-[#E5E5EA] focus:border-[#007AFF] text-[#000000] outline-none resize-none"
                        />
                        <textarea
                          value={roomFormData.content}
                          onChange={(e) => setRoomFormData({ ...roomFormData, content: e.target.value })}
                          placeholder="Room content (what users will learn)"
                          rows={3}
                          className="w-full px-4 py-3 bg-white rounded-xl border-2 border-[#E5E5EA] focus:border-[#007AFF] text-[#000000] outline-none resize-none font-mono text-[13px]"
                        />
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <label className="text-[13px] text-[#86868B] mb-2 block">Duration (minutes)</label>
                            <input
                              type="range"
                              min="5"
                              max="60"
                              step="5"
                              value={roomFormData.duration}
                              onChange={(e) => setRoomFormData({ ...roomFormData, duration: Number(e.target.value) })}
                              className="w-full"
                            />
                            <div className="text-center mt-1">
                              <span className="text-[#000000] font-semibold text-[16px]">{roomFormData.duration}</span>
                              <span className="text-[#86868B] text-[13px] ml-1">min</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setRoomFormData({ ...roomFormData, isUnlocked: !roomFormData.isUnlocked })}
                              className={`px-4 py-2 rounded-xl font-medium text-[13px] flex items-center gap-2 ${
                                roomFormData.isUnlocked
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {roomFormData.isUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
                              {roomFormData.isUnlocked ? 'Unlocked' : 'Locked'}
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddRoom(floor.id)}
                            className="flex-1 py-3 bg-[#007AFF] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                          >
                            <Plus size={18} />
                            Add Room
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setShowAddRoom(null);
                              setRoomFormData({ title: "", description: "", duration: 10, content: "", isUnlocked: true });
                            }}
                            className="px-4 py-3 bg-[#F5F5F7] text-[#000000] rounded-xl font-semibold"
                          >
                            <X size={18} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {floor.rooms.length === 0 && showAddRoom !== floor.id && (
                      <p className="text-[14px] text-[#86868B] text-center py-4">
                        No rooms in this floor yet. Use the floor menu to add a room.
                      </p>
                    )}

                    {floor.rooms.map((room, roomIndex) => (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: roomIndex * 0.08,
                          duration: 0.2,
                        }}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-white/70 shadow-card"
                      >
                        {editingRoomId === room.id ? (
                          <div className="space-y-4">
                            <input
                              type="text"
                              value={roomFormData.title}
                              onChange={(e) => setRoomFormData({ ...roomFormData, title: e.target.value })}
                              placeholder="Room title"
                              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-[#007AFF] text-[#000000] outline-none"
                            />
                            <textarea
                              value={roomFormData.description}
                              onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                              placeholder="Room description"
                              rows={2}
                              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-[#007AFF] text-[#000000] outline-none resize-none"
                            />
                            <textarea
                              value={roomFormData.content}
                              onChange={(e) => setRoomFormData({ ...roomFormData, content: e.target.value })}
                              placeholder="Room content"
                              rows={3}
                              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-[#007AFF] text-[#000000] outline-none resize-none font-mono text-[13px]"
                            />
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <label className="text-[13px] text-[#86868B] mb-2 block">Duration</label>
                                <input
                                  type="range"
                                  min="5"
                                  max="60"
                                  step="5"
                                  value={roomFormData.duration}
                                  onChange={(e) => setRoomFormData({ ...roomFormData, duration: Number(e.target.value) })}
                                  className="w-full"
                                />
                                <div className="text-center mt-1">
                                  <span className="font-semibold">{roomFormData.duration} min</span>
                                </div>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setRoomFormData({ ...roomFormData, isUnlocked: !roomFormData.isUnlocked })}
                                className={`px-4 py-2 rounded-xl font-medium text-[13px] flex items-center gap-2 ${
                                  roomFormData.isUnlocked
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {roomFormData.isUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
                                {roomFormData.isUnlocked ? 'Unlocked' : 'Locked'}
                              </motion.button>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSaveRoom(floor.id, room.id)}
                                className="flex-1 py-2 bg-[#007AFF] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                              >
                                <Save size={16} />
                                Save
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setEditingRoomId(null);
                                  setRoomFormData({ title: "", description: "", duration: 10, content: "", isUnlocked: true });
                                }}
                                className="px-4 py-2 bg-[#F5F5F7] text-[#000000] rounded-xl font-semibold"
                              >
                                <X size={16} />
                              </motion.button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-11 h-11 bg-gradient-to-br from-[#ADC8FF]/40 to-[#ADC8FF]/20 rounded-full flex items-center justify-center border border-white/50">
                                  <span className="text-small font-semibold text-[#091A7A]">
                                    {roomIndex + 1}
                                  </span>
                                </div>

                                <div className="flex-1">
                                  <h4 className="text-subheading text-[#091A7A] mb-1.5 font-medium">
                                    {room.title}
                                  </h4>
                                  <p className="text-[12px] text-[#86868B] mb-2">
                                    {room.description}
                                  </p>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                                      <span className="text-small text-[#6B7280] font-medium">
                                        {room.duration} min
                                      </span>
                                    </div>
                                    {room.isUnlocked ? (
                                      <div className="flex items-center gap-1">
                                        <Unlock className="w-3.5 h-3.5 text-green-600" />
                                        <span className="text-[11px] text-green-600 font-medium">
                                          Unlocked
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <Lock className="w-3.5 h-3.5 text-[#86868B]" />
                                        <span className="text-[11px] text-[#86868B]">
                                          Locked
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {room.isCompleted ? (
                                  <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                                    <CheckCircle className="w-4.5 h-4.5 text-green-600" />
                                  </div>
                                ) : room.isUnlocked ? (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onRoomClick?.(room.title)}
                                    className="w-9 h-9 bg-gradient-to-br from-[#091A7A] to-[#1A2FB8] rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <Play className="w-3.5 h-3.5 text-white" />
                                  </motion.button>
                                ) : (
                                  <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}

                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveRoomMenu(activeRoomMenu === room.id ? null : room.id);
                                  }}
                                  className="w-8 h-8 bg-[#F5F5F7] rounded-full flex items-center justify-center relative"
                                >
                                  <MoreVertical size={16} className="text-[#000000]" />
                                </motion.button>

                                <AnimatePresence>
                                  {activeRoomMenu === room.id && (
                                    <>
                                      <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-40"
                                        onClick={() => setActiveRoomMenu(null)}
                                      />
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                        className="absolute right-0 bg-white rounded-2xl shadow-2xl border border-[#E5E5EA] z-50 overflow-hidden min-w-[140px]"
                                      >
                                        <motion.button
                                          whileTap={{ scale: 0.98 }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveRoomMenu(null);
                                            handleEditRoom(floor.id, room);
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
                                            setActiveRoomMenu(null);
                                            setShowDeleteRoomConfirm({ floorId: floor.id, roomId: room.id });
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
                              </div>
                            </div>

                            {room.progress > 0 && !room.isCompleted && (
                              <div className="mt-3">
                                <div className="h-2 bg-[#ADC8FF]/25 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${room.progress}%`,
                                    }}
                                    transition={{
                                      delay: 0.3,
                                      duration: 0.8,
                                      ease: "easeOut",
                                    }}
                                    className="h-full bg-gradient-to-r from-[#091A7A] to-[#1A2FB8] rounded-full"
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>

      {/* Add Floor Modal */}
      <AnimatePresence>
        {showAddFloor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowAddFloor(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#000000]">
                    Add New Floor
                  </h3>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddFloor(false)}
                    className="w-8 h-8 bg-[#F5F5F7] rounded-full flex items-center justify-center"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
                <p className="text-[15px] text-[#86868B]">
                  Create a new floor to organize rooms in {palace.name}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[14px] font-medium text-[#000000] mb-2 block">
                    Floor Title
                  </label>
                  <input
                    type="text"
                    value={floorFormData.title}
                    onChange={(e) => setFloorFormData({ ...floorFormData, title: e.target.value })}
                    placeholder="e.g., Introduction Level"
                    className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all"
                  />
                </div>

                <div>
                  <label className="text-[14px] font-medium text-[#000000] mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={floorFormData.description}
                    onChange={(e) => setFloorFormData({ ...floorFormData, description: e.target.value })}
                    placeholder="Describe what users will learn on this floor..."
                    rows={4}
                    className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddFloor(false)}
                  className="flex-1 py-4 bg-[#F5F5F7] rounded-2xl font-semibold text-[#000000]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddFloor}
                  className="flex-1 py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
                >
                  <Folder size={20} />
                  Create Floor
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Floor Confirmation */}
      <AnimatePresence>
        {showDeleteFloorConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowDeleteFloorConfirm(null)}
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
                  Delete Floor?
                </h3>
                <p className="text-[15px] text-[#86868B]">
                  This will delete all rooms in this floor. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteFloorConfirm(null)}
                  className="flex-1 py-4 bg-[#F5F5F7] rounded-2xl font-semibold text-[#000000]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteFloor(showDeleteFloorConfirm)}
                  className="flex-1 py-4 bg-red-600 rounded-2xl font-semibold text-white"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Room Confirmation */}
      <AnimatePresence>
        {showDeleteRoomConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowDeleteRoomConfirm(null)}
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
                  Delete Room?
                </h3>
                <p className="text-[15px] text-[#86868B]">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteRoomConfirm(null)}
                  className="flex-1 py-4 bg-[#F5F5F7] rounded-2xl font-semibold text-[#000000]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteRoom(showDeleteRoomConfirm.floorId, showDeleteRoomConfirm.roomId)}
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