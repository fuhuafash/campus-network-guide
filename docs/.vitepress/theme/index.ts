// .vitepress/theme/index.ts
import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";


import "vitepress-theme-teek/theme-chalk/tk-doc-h1-gradient.css";
import "vitepress-theme-teek/theme-chalk/tk-nav.css";
import "vitepress-theme-teek/theme-chalk/tk-doc-fade-in.css";
import "vitepress-theme-teek/theme-chalk/tk-index-rainbow.css";

// 包一层 Teek 的 Layout，用来挂桌宠（见 Layout.vue）
import Layout from "./Layout.vue";

export default {
  extends: Teek,
  Layout,
};