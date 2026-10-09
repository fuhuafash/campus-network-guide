<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { inBrowser, withBase } from "vitepress";
import Teek from "vitepress-theme-teek";
import type { Mascot } from "web-mascot";

// 把 Teek 原本的 Layout 原样渲染，只是额外挂两只桌宠
// VitePress 合并主题时是 { ...Teek, ...本文件导出的主题 }，
const TeekLayout = Teek.Layout;

const PACKS = ["Neuron", "Eviling"];

// 宠物单独的层，原因见文件末尾的 <style>。
const LAYER_ID = "web-mascot-layer";

let mascots: Mascot[] = [];

function ensureLayer(): HTMLElement {
  const existing = document.getElementById(LAYER_ID);
  if (existing) return existing;
  const layer = document.createElement("div");
  layer.id = LAYER_ID;
  document.body.appendChild(layer);
  return layer;
}

onMounted(async () => {
  if (!inBrowser) return;

  const { configure, createMascot } = await import("web-mascot");

  // 带 base 前缀，本站 base 是 /campus-network-guide/
  configure({ assets: withBase("/mascot_pack") });

  const container = ensureLayer();
  mascots = await Promise.all(
    PACKS.map((pack) => createMascot({ container, pack }))
  );

  // Teek 自带的图片查看器（article-image-preview）会给页面上任何一张 <img>
  // 挂点击预览：它的监听目标是 #VPContent，取不到时会兜底成 window
  // （见 vitepress-theme-teek/es/composables/use-event-listener.mjs 的
  // `toValue(target) || window`），于是宠物这张精灵图一被点就弹预览
  // 表现就是抓宠物松开左键的瞬间弹出图片查看。
  // Teek 自己的头像 / banner / 卡片图都用 no-preview 这个类来豁免
  container.querySelectorAll("img").forEach((img) => {
    img.classList.add("no-preview");
  });
});

onUnmounted(() => {
  mascots.forEach((mascot) => mascot.destroy());
  mascots = [];
  document.getElementById(LAYER_ID)?.remove();
});
</script>

<template>
  <TeekLayout />
</template>

<style>
/*
 * 引擎给宠物根节点写死的层级是 z-index: 1（内联样式，而且没有 class/id
 * 外部样式表除了 !important 改不动它），所以进文章页后会被左侧栏盖住
 * VitePress 的层级是 侧边栏 60、遮罩 50、导航 30、局部导航 20
 * 让宠物自己占一层，整体抬到这些组件之上
 *
 */
#web-mascot-layer {
  position: fixed;
  inset: 0;
  z-index: 70;
  pointer-events: none;
}
</style>
