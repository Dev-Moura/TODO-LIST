/**
 * `useTasks` — realtime task CRUD backed by Cloud Firestore.
 *
 * Tasks live under `users/{uid}/tasks`. The hook subscribes with
 * `onSnapshot`, so every client signed in as the same user stays in sync
 * automatically.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * A task document as stored in Firestore (plus its document id).
 * @typedef {Object} Task
 * @property {string} id - Firestore document id.
 * @property {string} title - Task title.
 * @property {string} description - Optional long description.
 * @property {"normal"|"urgent"|"immediate"} priority - Priority level.
 * @property {boolean} completed - Whether the task is done.
 * @property {number} createdAt - Creation timestamp (ms since epoch).
 * @property {number|null} [completedAt] - When the task was completed, if ever.
 */

/** Data payload accepted when creating or editing a task. @typedef {{title: string, description: string, priority: import("../constants/priority").PriorityValue}} TaskInput */

/**
 * Subscribes to the signed-in user's tasks and exposes CRUD helpers.
 *
 * @param {string|null} userId - Authenticated user id (null while logged out).
 * @returns {{
 *   tasks: Task[],
 *   loading: boolean,
 *   addTask: (input: TaskInput) => Promise<void>,
 *   updateTask: (id: string, input: TaskInput) => Promise<void>,
 *   toggleTask: (task: Task) => Promise<void>,
 *   removeTask: (id: string) => Promise<Object|undefined>,
 *   restoreTask: (task: Object) => Promise<void>,
 *   migrateLegacyTasks: () => Promise<boolean>,
 * }} The task list, loading flag and mutation helpers.
 */
export function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId));

  // Keep a reference to the latest snapshot so migration can check whether
  // the user already has cloud tasks without extra reads.
  const hasCloudTasksRef = useRef(false);

  useEffect(() => {
    if (!userId || !db) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const tasksQuery = collection(db, "users", userId, "tasks");

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const next = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        next.sort(
          (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
        );
        hasCloudTasksRef.current = !snapshot.empty;
        setTasks(next);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  /** Reference to the user's task collection (null when logged out). */
  const tasksCollection = userId && db ? collection(db, "users", userId, "tasks") : null;

  /**
   * Creates a new task for the current user.
   * @param {TaskInput} input - Title, description and priority.
   * @returns {Promise<void>} Resolves when Firestore accepts the write.
   */
  const addTask = useCallback(
    async (input) => {
      if (!tasksCollection) return;
      await addDoc(tasksCollection, {
        title: input.title.trim(),
        description: input.description.trim(),
        priority: input.priority,
        completed: false,
        createdAt: Date.now(),
        completedAt: null,
      });
    },
    [tasksCollection]
  );

  /**
   * Updates an existing task's editable fields.
   * @param {string} id - Firestore document id.
   * @param {TaskInput} input - New title, description and priority.
   * @returns {Promise<void>} Resolves when the write is acknowledged.
   */
  const updateTask = useCallback(
    async (id, input) => {
      if (!tasksCollection) return;
      await updateDoc(doc(db, "users", userId, "tasks", id), {
        title: input.title.trim(),
        description: input.description.trim(),
        priority: input.priority,
      });
    },
    [tasksCollection, userId]
  );

  /**
   * Flips a task between pending and completed, recording the timestamp.
   * @param {Task} task - The task to toggle.
   * @returns {Promise<void>} Resolves when the write is acknowledged.
   */
  const toggleTask = useCallback(
    async (task) => {
      if (!tasksCollection) return;
      await updateDoc(doc(db, "users", userId, "tasks", task.id), {
        completed: !task.completed,
        completedAt: task.completed ? null : Date.now(),
      });
    },
    [tasksCollection, userId]
  );

  /**
   * Deletes a task permanently. Returns the removed data so callers can offer
   * an "undo" action via {@link restoreTask}.
   * @param {string} id - Firestore document id.
   * @returns {Promise<Object|undefined>} The deleted payload, when found.
   */
  const removeTask = useCallback(
    async (id) => {
      if (!tasksCollection) return undefined;
      const snapshotTask = tasks.find((t) => t.id === id);
      await deleteDoc(doc(db, "users", userId, "tasks", id));
      return snapshotTask;
    },
    [tasksCollection, userId, tasks]
  );

  /**
   * Re-creates a previously deleted task (used by the "undo" snackbar).
   * @param {Object} task - Previously deleted task payload (id is ignored).
   * @returns {Promise<void>} Resolves when the write is acknowledged.
   */
  const restoreTask = useCallback(
    async (task) => {
      if (!tasksCollection || !task) return;
      const { id: _ignored, ...payload } = task;
      await addDoc(tasksCollection, payload);
    },
    [tasksCollection]
  );

  /**
   * One-time import of tasks stored locally by the pre-Firebase version of
   * the app. Only runs when the user's cloud list is still empty, so it never
   * duplicates existing remote data.
   * @returns {Promise<boolean>} True when at least one task was imported.
   */
  const migrateLegacyTasks = useCallback(async () => {
    if (!tasksCollection || hasCloudTasksRef.current) return false;

    // Imported lazily to keep this module free of browser-only side effects.
    const [{ getLegacyTasks, clearLegacyTasks }] = await Promise.all([
      import("../utils/migration"),
    ]);
    const legacy = getLegacyTasks();
    if (legacy.length === 0) return false;

    try {
      const batch = writeBatch(db);
      legacy.forEach((task) => {
        batch.add(doc(tasksCollection), task);
      });
      await batch.commit();
      clearLegacyTasks();
      return true;
    } catch (error) {
      console.error("Legacy task migration failed:", error);
      return false;
    }
  }, [tasksCollection]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    toggleTask,
    removeTask,
    restoreTask,
    migrateLegacyTasks,
  };
}
