/**
 * Priority levels available in the app, with their display metadata.
 * Values are stable identifiers persisted to Firestore; labels/colors are
 * presentation-only.
 */

/** @typedef {"normal"|"urgent"|"immediate"} PriorityValue */

/**
 * Ordered list of priorities (lowest to highest).
 * @type {Array<{value: PriorityValue, label: string, color: string}>}
 */
export const PRIORITIES = [
  { value: "normal", label: "Normal", color: "#1a73e8" },
  { value: "urgent", label: "Urgente", color: "#f9ab00" },
  { value: "immediate", label: "Imediato", color: "#d93025" },
];

/** Default priority assigned to new tasks. @type {PriorityValue} */
export const DEFAULT_PRIORITY = "normal";

/**
 * Looks up the metadata of a priority by its value.
 * @param {PriorityValue} value - Priority identifier (falls back to `normal`).
 * @returns {{value: PriorityValue, label: string, color: string}} The
 *   matching priority definition.
 */
export function getPriority(value) {
  return PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[0];
}
