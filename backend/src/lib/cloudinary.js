import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { CircuitBreaker } from "../utils/CircuitBreaker.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryCircuitBreaker = new CircuitBreaker("CloudinaryService", {
  timeout: 8000, // 8s timeout for image uploads
  failureThreshold: 3,
  resetTimeout: 10000,
  maxConcurrent: 5,
});

/**
 * Upload to Cloudinary wrapped with CircuitBreaker and Fallback
 */
export const safeUpload = async (fileUri, options = {}) => {
  const fallbackHandler = async (err) => {
    console.warn("⚠️ Cloudinary CircuitBreaker Fallback executed:", err.message);
    // Return fallback payload instead of crashing or hanging request thread
    return {
      secure_url: typeof fileUri === "string" && fileUri.startsWith("http")
        ? fileUri
        : "/uploads/default-avatar.png",
      public_id: "fallback_image",
      fallback: true,
    };
  };

  return await cloudinaryCircuitBreaker.execute(
    () => cloudinary.uploader.upload(fileUri, options),
    fallbackHandler
  );
};

export default cloudinary;
