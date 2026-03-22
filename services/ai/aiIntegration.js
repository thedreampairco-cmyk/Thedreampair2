import axios from "axios";
import { ENV } from "../../config/env.js";
import { buildSystemPrompt } from "./buildSystemPrompt.js";
import { getUserMemory } from "../data/memoryStore.js";
import { getFilteredCatalog } from "../data/googleSheetsFetch.js";
import { handleError } from "../../errorHandler.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateAIResponse = async (chatId, userMessage) => {
  try {
    const history = getUserMemory(chatId);

    // 🔥 Fetch relevant catalog (basic name-based filtering for now)
    const catalog = await getFilteredCatalog({ name: userMessage });

    // Convert catalog to string (keep it lightweight)
    const catalogContext = catalog.length
      ? JSON.stringify(catalog.slice(0, 5)) // limit to 5 products
      : "No matching products found.";

    const response = await axios.post(
      GROQ_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `${buildSystemPrompt()}

STRICT RULE:
- You MUST answer ONLY using the product data provided below.
- Do NOT guess or assume prices.
- If product not found, say "I couldn't find that product in our catalog."

CATALOG DATA:
${catalogContext}
`,
          },
          ...history,
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const aiText =
      response.data?.choices?.[0]?.message?.content ||
      "Sorry, I didn't understand that.";

    return aiText;

  } catch (error) {
    handleError("Groq AI", error);

    return "⚠️ I'm having a little delay right now... try again in a moment 🙏";
  }
};
