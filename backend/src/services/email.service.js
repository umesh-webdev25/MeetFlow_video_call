import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { CircuitBreaker } from "../utils/CircuitBreaker.js";

dotenv.config();

export const emailCircuitBreaker = new CircuitBreaker("EmailService", {
  timeout: 5000, // 5s timeout for SMTP operations
  failureThreshold: 3,
  resetTimeout: 10000,
  maxConcurrent: 5,
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP email to user
 */
export const sendOTPEmail = async (email, otp, fullName) => {
  const mailOptions = {
    from: `"MeetFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your MeetFlow account",
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img
        src="https://res.cloudinary.com/da50pkdud/image/upload/v1780058090/video_vepjli.svg"
        alt="MeetFlow Logo"
        style="width: 90px; height: 90px; object-fit: contain;"
      />
    </div>
    <h2 style="color: #4f46e5; text-align: center;">Welcome to MeetFlow!</h2>
    <p>Hello <strong>${fullName}</strong>,</p>
    <p>Please use the OTP below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5; background: #f3f4f6; padding: 10px 20px; border-radius: 8px;">
        ${otp}
      </span>
    </div>
    <p>This OTP is valid for 10 minutes.</p>
  </div>
`,
  };

  const fallbackHandler = async (err) => {
    console.warn(`⚠️ Email CircuitBreaker Fallback for ${email}:`, err.message);
    // Degraded fallback behavior: Log warning and return without blocking thread
    return { success: false, fallback: true, error: err.message };
  };

  try {
    await emailCircuitBreaker.execute(
      () => transporter.sendMail(mailOptions),
      fallbackHandler
    );
    console.log(`✅ OTP email processed for ${email}`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Failed to send verification email");
  }
};

/**
 * Send 2FA login email to user
 */
export const send2FAEmail = async (email, otp, fullName) => {
  const mailOptions = {
    from: `"MeetFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your MeetFlow 2FA Code",
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img
        src="https://res.cloudinary.com/da50pkdud/image/upload/v1780058090/video_vepjli.svg"
        alt="MeetFlow Logo"
        style="width: 90px; height: 90px; object-fit: contain;"
      />
    </div>
    <h2 style="color: #4f46e5; text-align: center;">Login Attempt Detected</h2>
    <p>Hello <strong>${fullName}</strong>,</p>
    <p>Please use the verification code below to complete your login securely:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5; background: #f3f4f6; padding: 10px 20px; border-radius: 8px;">
        ${otp}
      </span>
    </div>
    <p>This code is valid for 10 minutes.</p>
  </div>
`,
  };

  const fallbackHandler = async (err) => {
    console.warn(`⚠️ 2FA Email CircuitBreaker Fallback for ${email}:`, err.message);
    return { success: false, fallback: true, error: err.message };
  };

  try {
    await emailCircuitBreaker.execute(
      () => transporter.sendMail(mailOptions),
      fallbackHandler
    );
    console.log(`✅ 2FA email processed for ${email}`);
  } catch (error) {
    console.error("❌ Error sending 2FA email:", error);
    throw new Error("Failed to send 2FA email");
  }
};

/**
 * Send Added to Group Email
 */
export const sendAddedToGroupEmail = async ({ to, inviterName, groupName, designation }) => {
  const mailOptions = {
    from: `"MeetFlow" <${process.env.EMAIL_USER}>`,
    to,
    subject: `You were added to ${groupName} Group`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">You were added to ${groupName} Group</h2>
        <p>${inviterName} added you to ${groupName} Group as:</p>
        <p><strong>${designation}</strong></p>
      </div>
    `,
  };

  const fallbackHandler = async (err) => {
    console.warn(`⚠️ Group Email CircuitBreaker Fallback for ${to}:`, err.message);
    return { success: false, fallback: true, error: err.message };
  };

  try {
    await emailCircuitBreaker.execute(
      () => transporter.sendMail(mailOptions),
      fallbackHandler
    );
    console.log(`✅ Group addition email processed for ${to}`);
  } catch (error) {
    console.error("❌ Error sending Group addition email:", error);
  }
};
