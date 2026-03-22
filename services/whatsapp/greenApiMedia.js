import axios from "axios";
import { ENV } from "../../config/env.js";
import { handleError } from "../../errorHandler.js";

const BASE_URL = `https://api.green-api.com/waInstance${ENV.GREEN_API_ID_INSTANCE}`;

/**
 * Send image message via WhatsApp (Green API)
 */
export const sendImageMessage = async (chatId, imageUrl, caption = "") => {
  try {
    const url = `${BASE_URL}/sendFileByUrl/${ENV.GREEN_API_API_TOKEN_INSTANCE}`;

    const payload = {
      chatId: chatId,
      urlFile: imageUrl,
      fileName: "product.jpg",
      caption: caption,
    };

    const response = await axios.post(url, payload);

    console.log("🖼️ Image sent:", response.data);

    return response.data;
  } catch (error) {
    handleError("Green API Media Error", error);
    return null;
  }
};
