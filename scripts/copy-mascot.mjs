// 把 web-mascot 包里的桌宠资源拷到 VitePress 的静态目录 docs/public。
// 拷贝产物不进 git（见 .gitignore），每次 dev / build 前自动生成。
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** pack 目录的两个必需文件，见库 README「加自己的宠物」。 */
const REQUIRED = ["actions.xml", "behaviors.xml"];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = resolve(root, "node_modules/web-mascot/dist/mascot_pack");
const destRoot = resolve(root, "docs/public/mascot_pack");
const manifest = resolve(root, "docs/.vitepress/mascot-packs.json");

if (!existsSync(srcRoot)) {
  console.error(`[mascot] 找不到桌宠资源目录：${srcRoot}\n请先执行 npm install。`);
  process.exit(1);
}

const isDir = (p) => {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
};

const packs = readdirSync(srcRoot)
  .filter((name) => isDir(resolve(srcRoot, name)))
  .filter((name) => REQUIRED.every((f) => existsSync(resolve(srcRoot, name, f))))
  .sort();

if (packs.length === 0) {
  console.error(
    `[mascot] ${srcRoot} 下没有找到任何 pack（判定标准：同时含 ${REQUIRED.join(" 与 ")}）。`
  );
  process.exit(1);
}

for (const pack of packs) {
  const src = resolve(srcRoot, pack);
  const dest = resolve(destRoot, pack);

  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });

  console.log(`[mascot] ${pack} -> docs/public/mascot_pack/${pack}`);
}

mkdirSync(dirname(manifest), { recursive: true });
writeFileSync(manifest, `${JSON.stringify(packs, null, 2)}\n`);
console.log(`[mascot] ${packs.length} 只宠物：${packs.join(", ")} -> docs/.vitepress/mascot-packs.json`);
