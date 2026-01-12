import fs from "fs";

const file = "dist/content.js";
let code = fs.readFileSync(file, "utf8");

/* --------------------------------------------------------- */
/* 1. Replace Function("return this")()                       */
/* --------------------------------------------------------- */
code = code.replace(
  /Function\("return this"\)\(\)/g,
  "globalThis"
);

/* --------------------------------------------------------- */
/* 2. Remove the other mofos (focus is read-only)              */
/* --------------------------------------------------------- */
code = code.replace(
  /((?:\w+\.)?HTMLElement\.prototype\.focus=[^,]*),?/g,
  ""
);

code = code.replace(
  /windowObject\.HTMLElement\.prototype\.focus\s*=\s*function\(\)\s*\{\s*[^}]*focus\.apply\(this, arguments\);\s*\};/g,
  ""
);

code = code.replace(
  /(document\.head\.appendChild\(__vite_style__\));/g,
  "function appendStyleSafely(style){if(document.head){document.head.appendChild(style);}else{const obs = new MutationObserver(()=>{if(document.head){obs.disconnect();document.head.appendChild(style);}});obs.observe(document.documentElement,{childList:true});}};appendStyleSafely(__vite_style__);"
)

/* --------------------------------------------------------- */
/* 3. Verify CSP cleanliness                                 */
/* --------------------------------------------------------- */
if (
  code.includes('Function("return this")')
) {
  console.error("❌ CSP violation still present");
  process.exit(1);
}

fs.writeFileSync(file, code);
console.log("✅ CSP cleanup done (firefox wont whine anymore)");