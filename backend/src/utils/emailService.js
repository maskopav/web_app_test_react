import { logToFile } from "./logger.js";

export async function sendCredentialsEmail(email, name, password, personalLink) {
  const emailBody = `
    ----------------------------------------------------
    📧 MOCK EMAIL TO: ${email}
    ----------------------------------------------------
    Dear ${name},

    Thank you for signing up.
    
    You can access your protocol anytime using this link:
    ${personalLink}

    If you need to log in manually, use:
    Password: ${password}
    
    ----------------------------------------------------
  `;
  
  // Log to console and file for testing
  console.log(emailBody);
  logToFile(`EMAIL SENT to ${email}`);
  
  return true;
}