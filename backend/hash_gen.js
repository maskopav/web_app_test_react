// backend/hash_gen.js
import bcrypt from "bcrypt";

const password = ""; // CHANGE THIS to your desired password
const hash = await bcrypt.hash(password, 12);

console.log("\n--- COPY THE HASH BELOW ---");
console.log(hash);
console.log("---------------------------\n");

// Run using node backend/hash_gen.js

// USAGE FOR GENERATING MASTER USER
// Insert manually into DB:
/*
INSERT INTO users (email, password_hash, full_name, role_id, is_active, must_change_password)
VALUES (
    'your_email@example.com', 
    '<PASTE_HASH_HERE>', 
    '<Master name>', 
    1, 
    1,
    1
);
*/

