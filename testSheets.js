import { getCatalogData } from "./services/data/googleSheetsFetch.js";

const test = async () => {
const data = await getCatalogData();

console.log("📦 FULL CATALOG:");
console.log(JSON.stringify(data, null, 2));
};

test();
