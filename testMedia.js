import { sendImageMessage } from "./services/whatsapp/greenApiMedia.js";

await sendImageMessage(
  "91XXXXXXXXXX@c.us",
  "https://your-direct-image-url",
  "Test product image"
);
