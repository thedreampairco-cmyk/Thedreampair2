import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
"PORT",
"GREEN_API_ID_INSTANCE",
"GREEN_API_API_TOKEN_INSTANCE",
"GROQ_API_KEY",
"MONGODB_URI",
"GOOGLE_SHEETS_API_KEY"
];

requiredEnvVars.forEach((key) => {
if (!process.env[key]) {
console.error("❌ Missing required environment variable: ${key}");
process.exit(1);
}
});

export const ENV = {
PORT: process.env.PORT,
GREEN_API_ID_INSTANCE: process.env.GREEN_API_ID_INSTANCE,
GREEN_API_API_TOKEN_INSTANCE: process.env.GREEN_API_API_TOKEN_INSTANCE,
GROQ_API_KEY: process.env.GROQ_API_KEY,
MONGODB_URI: process.env.MONGODB_URI,
GOOGLE_SHEETS_API_KEY: process.env.GOOGLE_SHEETS_API_KEY
};
