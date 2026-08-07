import { create } from "zustand";
import toast from "react-hot-toast";
import {
  fetchNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../lib/api";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchMyNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await fetchNotifications();
      set({ notifications: res.data || [], error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch notifications" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await getUnreadNotificationCount();
      set({ unreadCount: res.data.count });
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  },

  markAsRead: async (id) => {
    const previousNotifications = get().notifications;
    const previousUnreadCount = get().unreadCount;

    // Optimistic UI Update immediately
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));

    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      // Rollback UI to previous snapshot state
      set({
        notifications: previousNotifications,
        unreadCount: previousUnreadCount,
      });
      toast.error("Failed to update notification. Action rolled back.");
    }
  },

  markAllAsRead: async () => {
    const previousNotifications = get().notifications;
    const previousUnreadCount = get().unreadCount;

    // Optimistic UI Update immediately
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));

    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
      // Rollback UI to previous snapshot state
      set({
        notifications: previousNotifications,
        unreadCount: previousUnreadCount,
      });
      toast.error("Failed to mark all as read. Action rolled back.");
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
