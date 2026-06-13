const fs = require("fs");
const path = require("path");

const en = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== "node_modules") walk(p, acc);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) acc.push(fs.readFileSync(p, "utf8"));
  }
  return acc;
}

const src = walk("src").join("\n");
const unused = Object.keys(en).filter((k) => !src.includes(`"${k}"`) && !src.includes(`'${k}'`));
console.log(unused.join("\n"));
