<template>
  <div
    ref="cardEl"
    class="card-canvas"
    :style="{
      width: layout.cardSize.width,
      height: layout.cardSize.height,
    }"
  >
    <!-- 背景色兜底 -->
    <div class="bg-fallback" :style="{ background: fallbackBg }" />

    <!-- AI 生成的背景图（img 标签，比 CSS background-image 更可靠） -->
    <img
      v-if="backgroundUrl && !loading && !error"
      :src="backgroundUrl"
      class="bg-img"
      :class="{ loaded: imgLoaded }"
      alt=""
      @load="imgLoaded = true"
      @error="imgLoaded = false"
    />

    <!-- 遮罩层 -->
    <div
      class="overlay"
      :style="{ background: lightText ? layout.overlayDark : layout.overlay }"
    />

    <!-- 加载状态 -->
    <div v-if="loading || (backgroundUrl && !imgLoaded && !imgError)" class="loading-layer">
      <div class="spinner" />
      <span>AI 生成中...</span>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-layer">
      <span>⚠️ {{ error }}</span>
    </div>

    <template v-else>
      <!-- 头像 -->
      <div
        v-if="fields.avatarUrl"
        class="avatar-wrap"
        :style="{
          top: layout.avatarPosition.top,
          bottom: layout.avatarPosition.bottom,
          left: layout.avatarPosition.left,
          right: layout.avatarPosition.right,
          transform: layout.avatarPosition.translateX
            ? `translateX(${layout.avatarPosition.translateX})`
            : undefined,
          width: layout.avatarPosition.size,
          height: layout.avatarPosition.size,
          borderRadius:
            layout.avatarPosition.shape === 'circle'
              ? '50%'
              : layout.avatarPosition.shape === 'rounded'
                ? '16px'
                : '4px',
        }"
      >
        <img :src="fields.avatarUrl" class="avatar-img" alt="" />
      </div>

      <!-- 文字内容 -->
      <div
        class="content-area"
        :style="{
          top: layout.contentArea.top,
          bottom: layout.contentArea.bottom,
          left: layout.contentArea.left,
          right: layout.contentArea.right,
          padding: layout.contentArea.padding,
          textAlign: layout.contentArea.textAlign,
        }"
      >
        <div
          class="name-text"
          :style="{
            fontSize: layout.nameStyle.fontSize,
            fontWeight: layout.nameStyle.fontWeight,
            color: lightText ? layout.nameStyle.lightColor : layout.nameStyle.color,
            marginBottom: layout.nameStyle.marginBottom,
            textShadow: lightText ? '0 1px 8px rgba(0,0,0,0.6)' : '0 1px 4px rgba(0,0,0,0.08)',
          }"
        >
          {{ fields.name || '您的姓名' }}
        </div>

        <div
          class="info-text"
          :style="{
            fontSize: layout.infoStyle.fontSize,
            color: lightText ? layout.infoStyle.lightColor : layout.infoStyle.color,
            lineHeight: layout.infoStyle.lineHeight,
            textShadow: lightText ? '0 1px 4px rgba(0,0,0,0.5)' : 'none',
          }"
        >
          <div v-if="fields.phone">📱 {{ fields.phone }}</div>
          <div v-if="fields.wechat">💬 {{ fields.wechat }}</div>
          <div v-if="fields.address">📍 {{ fields.address }}</div>
        </div>
      </div>

      <!-- 布局名标签 -->
      <div v-if="showLabel" class="layout-label">{{ layout.name }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { LayoutConfig } from '@/layouts/index'
import type { CardFields } from '@/store/card'

const props = defineProps<{
  layout: LayoutConfig
  fields: CardFields
  backgroundUrl: string
  loading: boolean
  error: string
  lightText?: boolean
  showLabel?: boolean
}>()

const cardEl = ref<HTMLElement | null>(null)
const imgLoaded = ref(false)
const imgError = ref(false)

// backgroundUrl 变化时重置加载状态
watch(
  () => props.backgroundUrl,
  () => {
    imgLoaded.value = false
    imgError.value = false
  },
)

const fallbackBg = computed(() => {
  const map: Record<string, string> = {
    minimal: '#f0f0f8',
    darkpro: '#0a0f28',
    creative: 'linear-gradient(135deg,#6366f1,#ec4899)',
    classic: '#fff8e6',
  }
  return map[props.layout.id] || '#f0f0f0'
})

defineExpose({ cardEl })
</script>

<style scoped>
.card-canvas {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card-canvas:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.22);
}

.bg-fallback {
  position: absolute;
  inset: 0;
}

.bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.bg-img.loaded {
  opacity: 1;
}

.overlay {
  position: absolute;
  inset: 0;
}

.loading-layer,
.error-layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 13px;
  color: #888;
  z-index: 2;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e0e0f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.avatar-wrap {
  position: absolute;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  z-index: 3;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.content-area {
  position: absolute;
  z-index: 3;
}

.name-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-text > div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layout-label {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 10px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  border-radius: 6px;
  padding: 2px 7px;
  z-index: 4;
}
</style>
