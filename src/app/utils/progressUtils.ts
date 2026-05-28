const STORAGE_KEY = "memory-palace-progress";
const BACKUP_KEY = "memory-palace-progress-backup";

export const ProgressUtils = {
  /**
   * Export progress data as a downloadable JSON file
   */
  exportProgress: () => {
    const progress = localStorage.getItem(STORAGE_KEY);
    if (progress) {
      const blob = new Blob([progress], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `memory-palace-progress-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      console.log("📦 Progress exported");
    }
  },

  /**
   * Import progress data from a JSON file
   */
  importProgress: (file: File): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);

          // Backup current progress before importing
          const current = localStorage.getItem(STORAGE_KEY);
          if (current) {
            localStorage.setItem(BACKUP_KEY, current);
          }

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data),
          );
          console.log("📥 Progress imported successfully");
          resolve();
        } catch (error) {
          console.error("❌ Failed to import progress:", error);
          reject(error);
        }
      };
      reader.onerror = () =>
        reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  },

  /**
   * Clear all progress data
   */
  clearProgress: () => {
    // Backup before clearing
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      localStorage.setItem(BACKUP_KEY, current);
    }

    localStorage.removeItem(STORAGE_KEY);
    console.log("🗑️ Progress cleared");
  },

  /**
   * Restore progress from backup
   */
  restoreFromBackup: () => {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) {
      localStorage.setItem(STORAGE_KEY, backup);
      console.log("🔄 Progress restored from backup");
      return true;
    }
    console.warn("⚠️ No backup found");
    return false;
  },

  /**
   * Get storage usage info
   */
  getStorageInfo: () => {
    const progress = localStorage.getItem(STORAGE_KEY);
    const backup = localStorage.getItem(BACKUP_KEY);

    return {
      hasProgress: !!progress,
      hasBackup: !!backup,
      progressSize: progress ? new Blob([progress]).size : 0,
      backupSize: backup ? new Blob([backup]).size : 0,
    };
  },
};