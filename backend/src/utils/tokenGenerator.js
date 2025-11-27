import crypto from "crypto";

export function generateAccessToken() {
  return crypto.randomBytes(16).toString("hex"); 
}
