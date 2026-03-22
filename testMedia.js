import { sendImageMessage } from "./services/whatsapp/greenApiMedia.js";

await sendImageMessage(
  "918426862111@c.us",
  "https://your-direct-image-url",
  "Test product image"
);
