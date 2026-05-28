import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useProgressState } from "../../hooks/useProgressState";

export function TrainingCalendar() {
  const { state } = useProgressState();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 21)); // May 21, 2026

  const today = new Date(2026, 4, 21);

  const trainingDatesSet = useMemo(() => {
    return new Set(
      state.trainingDays.map((dateStr) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
    );
  }, [state.trainingDays]);

  const daysInWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: Array<{
      date: number;
      month: "prev" | "current" | "next";
      isToday: boolean;
      hasTraining: boolean;
      fullDate: string;
    }> = [];

    // Previous month days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = prevMonthLastDay - i;
      const fullDate = `${year}-${month - 1}-${date}`;
      days.push({
        date,
        month: "prev",
        isToday: false,
        hasTraining: trainingDatesSet.has(fullDate),
        fullDate,
      });
    }

    // Current month days
    for (let date = 1; date <= daysInMonth; date++) {
      const fullDate = `${year}-${month}-${date}`;
      const isToday =
        date === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      days.push({
        date,
        month: "current",
        isToday,
        hasTraining: trainingDatesSet.has(fullDate),
        fullDate,
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let date = 1; date <= remainingDays; date++) {
      const fullDate = `${year}-${month + 1}-${date}`;
      days.push({
        date,
        month: "next",
        isToday: false,
        hasTraining: trainingDatesSet.has(fullDate),
        fullDate,
      });
    }

    return days;
  }, [currentDate, trainingDatesSet, today]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="p-6 bg-card-glass backdrop-blur-lg rounded-[20px] shadow-card border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-section-header text-[#091A7A]">{monthName}</h3>
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth("prev")}
            className="w-8 h-8 flex items-center justify-center rounded-[12px] transition-all duration-200 hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4 text-[#091A7A] stroke-[1.5]" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth("next")}
            className="w-8 h-8 flex items-center justify-center rounded-[12px] transition-all duration-200 hover:bg-white/20"
          >
            <ChevronRight className="w-4 h-4 text-[#091A7A] stroke-[1.5]" />
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Day headers */}
        {daysInWeek.map((day, i) => (
          <div
            key={`header-${i}`}
            className="text-center text-tiny text-[#6B7280] font-semibold py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {monthData.map((dayObj, index) => {
          const isCurrentMonth = dayObj.month === "current";
          const isPastMonth = dayObj.month === "prev";

          return (
            <motion.button
              key={`${dayObj.fullDate}-${index}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.5 + index * 0.01,
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              whileTap={{ scale: 0.95 }}
              className={`
                aspect-square flex items-center justify-center rounded-[12px] text-small font-medium transition-all duration-200 relative
                ${
                  dayObj.isToday
                    ? "bg-gradient-to-br from-[#091A7A] to-[#1A2FB8] text-white shadow-lg scale-105"
                    : isCurrentMonth
                    ? "text-[#091A7A] hover:bg-white/30"
                    : "text-[#C7C7CC] hover:bg-white/10"
                }
                ${
                  dayObj.hasTraining && !dayObj.isToday && isCurrentMonth
                    ? "ring-2 ring-[#10B981] ring-inset"
                    : ""
                }
              `}
              disabled={!isCurrentMonth}
            >
              <span className="relative z-10">{dayObj.date}</span>
              {dayObj.hasTraining && !dayObj.isToday && isCurrentMonth && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-[#10B981] rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#091A7A] to-[#1A2FB8]" />
          <span className="text-xs text-[#6B7280]">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#10B981]" />
          <span className="text-xs text-[#6B7280]">Training Day</span>
        </div>
      </div>
    </motion.div>
  );
}