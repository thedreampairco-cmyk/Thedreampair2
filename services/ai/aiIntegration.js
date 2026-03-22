import axios from "axios";
import { ENV } from "../../config/env.js";
import { buildSystemPrompt } from "./buildSystemPrompt.js";
import { getUserMemory } from "../data/memoryStore.js";
import { getFilteredCatalog } from "../data/googleSheetsFetch.js";
import { handleError } from "../../errorHandler.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateAIResponse = async (chatId, userMessage) => {
  try {
    console.log("\n🧠 USER QUERY:", userMessage);

    const history = getUserMemory(chatId);

    // Step 1: Raw fetch
    const fullCatalog = await getFilteredCatalog();
    console.log("📦 FULL CATALOG COUNT:", fullCatalog.length);

    // Step 2: Clean query
    const cleanedQuery = userMessage
      .toLowerCase()
      .replace(/price|cost|rs|₹|\?|under|above/g, "")
      .trim();

    console.log("🧹 CLEANED QUERY:", cleanedQuery);

    const keywords = cleanedQuery.split(" ").filter(word => word.length > 2);
    console.log("🔑 KEYWORDS:", keywords);

    // Step 3: Filtering
    const matchedProducts = fullCatalog.filter(product => {
      const name = product.name.toLowerCase();

      return keywords.some(keyword => name.includes(keyword));
    });

    console.log("🎯 MATCHED PRODUCTS:", matchedProducts);

    const catalogContext = matchedProducts.length
      ? JSON.stringify(matchedProducts.slice(0, 5))
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
