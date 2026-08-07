import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import Logger from "../utils/logger.js";

const executeBatchInTransaction = async (operation) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    if (session) {
      try {
        await session.abortTransaction();
      } catch (_) {}
    }
    // Fallback if standalone MongoDB without replica set
    if (
      err.message?.includes("Transaction numbers are only allowed") ||
      err.message?.includes("replica set") ||
      err.code === 20
    ) {
      return await operation(null);
    }
    throw err;
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

class NotificationService {
  setIo(io) {
    this.io = io;
  }

  async send(data) {
    const { recipientId, senderId, type, title, content, metaData } = data;

    try {
      // 1. Create In-app Notification
      const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type,
        title,
        content,
        data: metaData,
      });

      // 2. Real-time Delivery (Integration with Stream or Sockets)
      this.deliverRealtime(recipientId, notification);

      // 3. Push Notification (Mock)
      this.sendPushNotification(recipientId, notification);

      return notification;
    } catch (error) {
      Logger.error(`Notification Error: ${error.message}`);
    }
  }

  /**
   * Bulk insertion method replacing loop-based individual saves
   * Chunks large payloads to avoid oversized statements and long locks.
   */
  async sendMany(itemsData, { chunkSize = 500 } = {}) {
    if (!Array.isArray(itemsData) || itemsData.length === 0) return [];

    try {
      const formattedItems = itemsData.map((data) => ({
        recipient: data.recipientId || data.recipient,
        sender: data.senderId || data.sender,
        type: data.type,
        title: data.title,
        content: data.content,
        data: data.metaData || data.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const allCreated = [];

      // Process in chunks of chunkSize to prevent oversized BSON payloads and long locks
      for (let i = 0; i < formattedItems.length; i += chunkSize) {
        const chunk = formattedItems.slice(i, i + chunkSize);

        const createdChunk = await executeBatchInTransaction(async (session) => {
          const options = session ? { session } : {};
          return await Notification.insertMany(chunk, options);
        });

        allCreated.push(...createdChunk);
      }

      // Realtime notification delivery for batch items
      for (const notification of allCreated) {
        this.deliverRealtime(notification.recipient, notification);
        this.sendPushNotification(notification.recipient, notification);
      }

      return allCreated;
    } catch (error) {
      Logger.error(`Notification sendMany Error: ${error.message}`);
      throw error;
    }
  }

  async getMyNotifications(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    return await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "fullName profilePic");
  }

  async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  async getUnreadCount(userId) {
    return await Notification.countDocuments({ recipient: userId, isRead: false });
  }

  // Integration points for external delivery
  deliverRealtime(recipientId, notification) {
    try {
      if (this.io) {
        this.io.to(`user:${recipientId}`).emit("new_notification", notification);
        Logger.info(`Realtime notification sent to user:${recipientId}`);
      }
    } catch (e) {
      Logger.error(`Realtime notification error: ${e.message}`);
    }
  }

  sendPushNotification(recipientId, notification) {
    // Integration with Firebase (FCM) or OneSignal
    Logger.info(`Push notification queued for ${recipientId}`);
  }

  async notifyGroupMembers(meeting, group) {
    try {
      const User = (await import("../models/User.js")).default;
      const admin = await User.findById(meeting.createdBy);
      const adminName = admin ? admin.fullName : "An admin";

      const notificationPayloads = [];

      for (const member of group.members) {
        if (member.userId.toString() === meeting.createdBy.toString()) continue;

        notificationPayloads.push({
          recipientId: member.userId,
          senderId: meeting.createdBy,
          type: "meeting_invite",
          title: "New Group Meeting Scheduled",
          content: `${adminName} scheduled "${meeting.title}" in ${group.groupName} for ${meeting.date} at ${meeting.time}.`,
          metaData: {
            groupId: group._id,
            meetingId: meeting._id,
            scheduledAt: meeting.scheduledAt,
          },
        });
      }

      if (notificationPayloads.length > 0) {
        await this.sendMany(notificationPayloads);
      }
    } catch (error) {
      Logger.error(`notifyGroupMembers Error: ${error.message}`);
    }
  }
}

export default new NotificationService();
