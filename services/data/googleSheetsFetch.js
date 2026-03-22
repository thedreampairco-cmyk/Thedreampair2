import axios from "axios";
import { ENV } from "../../config/env.js";
import { handleError } from "../../errorHandler.js";

const SHEET_ID = "1ElneBHWnZjpyA-JYGmanZZ7aKvfjK-OsnrMbPpBAfUI";
const SHEET_NAME = "PRODUCTS";

/**
 * Fetch raw data from Google Sheets
 */
const fetchSheetData = async () => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${ENV.GOOGLE_SHEETS_API_KEY}`;

    const response = await axios.get(url);

    return response.data.values;
  } catch (error) {
    handleError("Google Sheets Fetch Error", error);
    return null;
  }
};

/**
 * Validate image URL (CRITICAL RULE ENFORCER)
 */
const isValidImageUrl = (url) => {
  if (!url) return false;

  return (
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
};

/**
 * Normalize sheet data into structured JSON
 */
const normalizeData = (rows) => {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];

  return rows.slice(1).map((row) => {
    const imageRaw = row[headers.indexOf("Image")] || "";

    return {
      id: row[headers.indexOf("ID")] || "",
      name: row[headers.indexOf("Name")] || "",
      category: row[headers.indexOf("Catagory")] || "",
      color: row[headers.indexOf("Colour")] || "",
      price: row[headers.indexOf("Price")] || "",
      sizes: row[headers.indexOf("Sizes")] || "",
      stock: row[headers.indexOf("Stock")] || "",
      image: isValidImageUrl(imageRaw) ? imageRaw : null,
      gender: row[headers.indexOf("Gender Preference")] || "",
    };
  });
};

/**
 * Filter catalog based on user preferences
 */
const filterCatalogData = (catalog, filters = {}) => {
  const { name, category, color, size } = filters;

  return catalog.filter((product) => {
    // Must have valid image
    if (!product.image) return false;

    const matchName = name
      ? product.name.toLowerCase().includes(name.toLowerCase())
      : true;

    const matchCategory = category
      ? product.category.toLowerCase().includes(category.toLowerCase())
      : true;

    const matchColor = color
      ? product.color.toLowerCase().includes(color.toLowerCase())
      : true;

    const matchSize = size
      ? product.sizes.toString().includes(size.toString())
      : true;

    return matchName && matchCategory && matchColor && matchSize;
  });
};

/**
 * Public function to get full catalog
 */
export const getCatalogData = async () => {
  try {
    const rawData = await fetchSheetData();
    const formattedData = normalizeData(rawData);

    return formattedData;
  } catch (error) {
    handleError("Catalog Processing Error", error);
    return [];
  }
};

/**
 * Public function to get filtered catalog (USED BY AI)
 */
export const getFilteredCatalog = async (filters = {}) => {
  try {
    const catalog = await getCatalogData();
    const filtered = filterCatalogData(catalog, filters);

    return filtered;
  } catch (error) {
    handleError("Catalog Filter Error", error);
    return [];
  }
};
