/**
 * Legacy data migration helpers.
 *
 * Before the Firebase redesign, tasks lived in `localStorage` under the
 * `todo_app_v1` key with a slightly different schema (capitalized fields such
 * as `Description` and `Priority`). These utilities read, normalize and clear
 * that legacy data so returning users don't lose their tasks on first sign-in.
 */

/** Key used by the pre-Firebase version of the app. @type {string} */
export const LEGACY_STORAGE_KEY = "todo_app_v1";

/**
 * A normalized task ready to be written to Firestore.
 * @typedef {Object} NormalizedTask
 * @property {string} title - Task title.
 * @property {string} description - Optional long description.
 * @property {"normal"|"urgent"|"immediate"} priority - Normalized priority.
 * @property {boolean} completed - Whether the task is done.
 * @property {number} createdAt - Creation timestamp in milliseconds.
 */

/**
 * Reads and normalizes the legacy tasks stored in `localStorage`.
 * @returns {NormalizedTask[]} An array of normalized tasks (empty when there
 *   is nothing to migrate or when the stored payload is corrupted).
 */
export function getLegacyTasks() {
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((t) => t && typeof t.text === "string" && t.text.trim())
      .map((t) => ({
        title: t.text.trim(),
        description: typeof t.Description === "string" ? t.Description : "",
        priority:
          t.Priority === "Urgente"
            ? "urgent"
            : t.Priority === "Imediato"
              ? "immediate"
              : "normal",
        completed: Boolean(t.completed),
        createdAt: Number(t.createdAt) || Date.now(),
      }));
  } catch {
    return [];
  }
}

/**
 * Removes the legacy storage key after a successful migration.
 * @returns {void}
 */
export function clearLegacyTasks() {
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* storage unavailable — nothing else to do */
  }
}
