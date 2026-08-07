import cron from "node-cron";
import ScheduleMeeting from "../models/Schedulemeeting.js";
import Group from "../models/group.js";
import NotificationService from "./notification.service.js";

let ioInstance = null;

export const setIo = (io) => {
  ioInstance = io;
};

// Check every minute
const meetingReminderCron = cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60000);
    
    // Find upcoming meetings starting in the next 15 minutes
    const upcomingMeetings = await ScheduleMeeting.find({
      status: "upcoming",
      scheduledAt: { $gt: now, $lte: fifteenMinutesFromNow }
    }).populate("groupId", "groupName members");

    if (upcomingMeetings.length === 0) return;

    const notificationPayloads = [];
    const meetingIdsToUpdate = [];

    for (const meeting of upcomingMeetings) {
      if (!meeting.groupId) continue;

      const group = meeting.groupId;
      const meetingIdStr = meeting._id.toString();
      meetingIdsToUpdate.push(meeting._id);

      // Emit socket event to the group members
      if (ioInstance) {
        group.members.forEach((member) => {
          ioInstance.to(`user:${member.userId.toString()}`).emit("meeting_reminder", {
            meetingId: meetingIdStr,
            title: meeting.title,
            groupName: group.groupName,
            scheduledAt: meeting.scheduledAt,
          });
        });
      }

      // Collect notification payloads for bulk insertion
      group.members.forEach((member) => {
        notificationPayloads.push({
          recipientId: member.userId,
          title: "Meeting Reminder",
          content: `The meeting "${meeting.title}" in group "${group.groupName}" is starting in less than 15 minutes!`,
          type: "meeting_reminder",
          metaData: {
            groupId: group._id,
            meetingId: meetingIdStr,
          },
        });
      });
    }

    // 1. Bulk insert all notifications in a single batched database operation
    if (notificationPayloads.length > 0) {
      await NotificationService.sendMany(notificationPayloads);
    }

    // 2. Bulk update all affected meeting statuses in a single statement
    if (meetingIdsToUpdate.length > 0) {
      await ScheduleMeeting.updateMany(
        { _id: { $in: meetingIdsToUpdate } },
        { $set: { status: "pending" } }
      );
    }
  } catch (error) {
    console.error("Cron Job Error (meetingReminder):", error);
  }
});

export const startCronJobs = () => {
  meetingReminderCron.start();
  console.log("Cron jobs started");
};
