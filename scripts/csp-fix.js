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
/* 2. Remove the other mofo (focus is read-only)              */
/* --------------------------------------------------------- */
code = code.replace(
  /(a\.HTMLElement\.prototype\.focus=Ll.get\(a\)\.focus),/g,
  ""
);

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