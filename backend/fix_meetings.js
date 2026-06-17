import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./src/lib/db.js";

dotenv.config();

async function fixMeetings() {
  try {
    await connectDB();
    
    const Meeting = (await import("./src/models/Meeting.js")).default;
    const result = await Meeting.updateMany(
      { status: "active" },
      { $set: { status: "ended", activeParticipants: 0, endedAt: new Date() } }
    );
    console.log(`Fixed ${result.modifiedCount} stuck meetings.`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

fixMeetings();
