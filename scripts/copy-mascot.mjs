// 把 web-mascot 包里的精灵拷到 VitePress 的静态目录 docs/public。
//
// 为什么需要这一步：打包器会重写 import.meta.url，库无法再自己推导出精灵的位置，
// 所以精灵必须以「站点静态资源」的形式存在，再由主题里的 configure({ assets }) 指过去。
// 拷贝产物不进 git（见 .gitignore），每次 dev / build 前自动生成。
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** 要挂几只就写几只。这里加/减宠物时，记得同步 Layout.vue 里的 PACKS。 */
const PACKS = ["Neuron", "Eviling"];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = resolve(root, "node_modules/web-mascot/dist/mascot_pack");
const destRoot = resolve(root, "docs/public/mascot_pack");

if (!existsSync(srcRoot)) {
  console.error(`[mascot] 找不到精灵目录：${srcRoot}\n        请先执行 npm install。`);
  process.exit(1);
}

for (const pack of PACKS) {
  const src = resolve(srcRoot, pack);
  const dest = resolve(destRoot, pack);

  if (!existsSync(src)) {
    console.error(`[mascot] 包内没有名为 "${pack}" 的精灵：${src}`);
    process.exit(1);
  }

  // 整目录拷贝（含 LICENSE / LICENSE-CC-BY-NC-SA-4.0.txt，署名必须随资源保留）。
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });

  console.log(`[mascot] ${pack} -> docs/public/mascot_pack/${pack}`);
}
