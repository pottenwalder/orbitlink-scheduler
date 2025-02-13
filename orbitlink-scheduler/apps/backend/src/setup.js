const fs = require("fs");
const path = require("path");

const directories = [
  "src",
  "src/config",
  "src/middleware",
  "src/routes",
  "src/services",
];

directories.forEach((dir) => {
  const fullPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

console.log("Directory structure created successfully");
