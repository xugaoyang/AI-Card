<template>
  <div class="preview-page">
    <!-- 顶部导航 -->
    <div class="topbar">
      <button class="back-btn" @click="router.push('/')">← 重新填写</button>
      <h1>选择名片样式</h1>
      <button class="settings-btn" @click="router.push('/settings')">⚙️</button>
    </div>

    <!-- 无数据提示 -->
    <div v-if="store.generatedCards.length === 0" class="empty">
      <p>还没有生成名片，请返回填写信息</p>
      <button class="go-btn" @click="router.push('/')">去填写</button>
    </div>

    <div v-else class="content">
      <!-- 状态栏 -->
      <div class="status-bar">
        <span v-if="store.isGenerating" class="status-generating">
          <span class="dot-spinner" /> AI 正在生成中...
        </span>
        <span v-else class="status-done">✅ 生成完成，点击名片下载 PNG</span>

        <!-- 文字颜色切换 -->
        <div class="text-toggle">
          <span class="toggle-label">文字颜色：</span>
          <button
            class="toggle-btn"
            :class="{ active: !store.lightText }"
            @click="store.lightText = false"
          >深色</button>
          <button
            class="toggle-btn"
            :class="{ active: store.lightText }"
            @click="store.lightText = true"
          >亮色</button>
        </div>
      </div>

      <!-- 名片网格 -->
      <div class="card-grid">
        <div
          v-for="card in store.generatedCards"
          :key="card.layoutId"
          class="card-wrapper"
          @click="download(card.layoutId)"
        >
          <CardCanvas
            :ref="(el) => setCardRef(card.layoutId, el)"
            :layout="getLayout(card.layoutId)"
            :fields="store.fields"
            :background-url="card.backgroundUrl"
            :loading="card.loading"
            :error="card.error"
            :light-text="store.lightText"
            :show-label="true"
          />
          <div class="download-hint">
            <span v-if="!card.loading && !card.error">⬇️ 点击下载</span>
          </div>
        </div>
      </div>

      <!-- 重新生成按钮 -->
      <button class="regen-btn" @click="router.push('/')">🔄 重新生成</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCardStore } from '@/store/card'
import { layouts } from '@/layouts/index'
import { exportCardAsPng } from '@/utils/export'
import CardCanvas from '@/components/CardCanvas.vue'

const router = useRouter()
const store = useCardStore()

const cardRefs = ref<Record<string, InstanceType<typeof CardCanvas> | null>>({})

function setCardRef(layoutId: string, el: unknown) {
  cardRefs.value[layoutId] = el as InstanceType<typeof CardCanvas> | null
}

function getLayout(layoutId: string) {
  return layouts.find((l) => l.id === layoutId) || layouts[0]
}

async function download(layoutId: string) {
  const card = store.generatedCards.find((c) => c.layoutId === layoutId)
  if (!card || card.loading || card.error) return

  const ref = cardRefs.value[layoutId]
  const el = ref?.cardEl
  if (!el) return

  await exportCardAsPng(el, `card-${layoutId}-${Date.now()}.png`)
}
</script>

<style scoped>
.preview-page {
  min-height: 100vh;
  background: #f5f6fa;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}

h1 {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #6366f1;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #f0f0ff;
}

.settings-btn {
  background: #f5f5ff;
  border: none;
  border-radius: 8px;
  padding: 7px 10px;
  cursor: pointer;
  font-size: 16px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  color: #aaa;
  font-size: 15px;
}
.go-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.content {
  padding: 20px 16px 60px;
  max-width: 960px;
  margin: 0 auto;
}

.status-bar {
  font-size: 13px;
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.text-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
}
.toggle-label {
  font-size: 12px;
  color: #888;
}
.toggle-btn {
  padding: 4px 14px;
  border-radius: 20px;
  border: 1.5px solid #e0e0f0;
  background: #f5f5ff;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.toggle-btn.active {
  background: #6366f1;
  border-color: #6366f1;
  color: #fff;
  font-weight: 600;
}

.status-generating {
  color: #8b5cf6;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.status-done {
  color: #22c55e;
}

.dot-spinner {
  width: 10px;
  height: 10px;
  border: 2px solid #d9c5ff;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  align-items: flex-start;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.download-hint {
  font-size: 12px;
  color: #888;
  height: 18px;
}

.regen-btn {
  display: block;
  margin: 32px auto 0;
  background: #fff;
  border: 2px solid #6366f1;
  border-radius: 12px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 600;
  color: #6366f1;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.regen-btn:hover {
  background: #6366f1;
  color: #fff;
}
</style>
