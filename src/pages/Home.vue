<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <div class="topbar">
      <div class="logo">🪪 AI 名片生成器</div>
      <button class="settings-btn" @click="router.push('/settings')">⚙️ 设置</button>
    </div>

    <div class="content">
      <!-- 头像上传 -->
      <div class="section">
        <h2 class="section-title">头像</h2>
        <div class="avatar-upload" @click="triggerFileInput">
          <img v-if="store.fields.avatarUrl" :src="store.fields.avatarUrl" class="avatar-img" />
          <div v-else class="avatar-placeholder">
            <span class="avatar-icon">📷</span>
            <span>点击上传头像</span>
          </div>
        </div>
        <input ref="fileInput" type="file" accept="image/*" hidden @change="onFileChange" />
      </div>

      <!-- 信息填写 -->
      <div class="section">
        <h2 class="section-title">名片信息</h2>
        <div class="form">
          <div class="form-item">
            <label>姓名 *</label>
            <input v-model="store.fields.name" type="text" placeholder="请输入姓名" class="input" />
          </div>
          <div class="form-item">
            <label>手机</label>
            <input v-model="store.fields.phone" type="tel" placeholder="请输入手机号码" class="input" />
          </div>
          <div class="form-item">
            <label>微信</label>
            <input v-model="store.fields.wechat" type="text" placeholder="请输入微信号" class="input" />
          </div>
          <div class="form-item">
            <label>地址</label>
            <input v-model="store.fields.address" type="text" placeholder="请输入地址" class="input" />
          </div>
        </div>
      </div>

      <!-- 背景提示词 -->
      <div class="section">
        <h2 class="section-title">背景提示词</h2>
        <p class="section-sub">描述你想要的名片背景风格，支持中英文</p>

        <textarea
          v-model="customPrompt"
          class="prompt-input"
          placeholder="例如：赛博朋克风格，霓虹灯夜景，紫色和粉色渐变，未来感十足"
          rows="3"
        />

        <!-- 快捷风格标签 -->
        <div class="preset-label">快速参考：</div>
        <div class="preset-list">
          <button
            v-for="p in presets"
            :key="p.label"
            class="preset-btn"
            :class="{ active: customPrompt === p.prompt }"
            @click="customPrompt = p.prompt"
          >
            {{ p.emoji }} {{ p.label }}
          </button>
        </div>
      </div>

      <!-- 布局模板 -->
      <div class="section">
        <h2 class="section-title">布局模板</h2>
        <p class="section-sub">选择一种或多种布局，每种布局独立生成</p>
        <div class="layout-list">
          <div
            v-for="layout in layouts"
            :key="layout.id"
            class="layout-item"
            :class="{ active: selectedLayouts.includes(layout.id) }"
            @click="toggleLayout(layout.id)"
          >
            <div class="layout-thumb" :style="getThumbStyle(layout)">
              <!-- 头像占位 -->
              <div class="thumb-avatar" :style="getThumbAvatarStyle(layout)" />
              <!-- 文字线条占位 -->
              <div class="thumb-lines" :style="getThumbLinesStyle(layout)">
                <div class="thumb-line thick" />
                <div class="thumb-line" />
                <div class="thumb-line short" />
              </div>
            </div>
            <div class="layout-name">{{ layout.name }}</div>
            <div v-if="selectedLayouts.includes(layout.id)" class="layout-check">✓</div>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMsg" class="error-tip">⚠️ {{ errorMsg }}</div>

      <!-- 生成按钮 -->
      <button class="generate-btn" :disabled="store.isGenerating || selectedLayouts.length === 0" @click="generate">
        <span v-if="store.isGenerating">
          <span class="btn-spinner" /> 生成中...
        </span>
        <span v-else>✨ 生成 {{ selectedLayouts.length }} 种布局名片</span>
      </button>

      <p class="bottom-tip">每种布局将使用相同提示词独立生成背景图</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCardStore } from '@/store/card'
import { generateImage } from '@/api/aiImage'
import { layouts } from '@/layouts/index'
import type { LayoutConfig } from '@/layouts/index'

const router = useRouter()
const store = useCardStore()
const fileInput = ref<HTMLInputElement | null>(null)
const errorMsg = ref('')

const customPrompt = ref('')
const selectedLayouts = ref<string[]>(layouts.map((l) => l.id))

// 快捷提示词预设
const presets = [
  {
    emoji: '💼',
    label: '商业简约',
    prompt: 'ultra premium business card background, polished white Carrara marble surface with delicate 24K gold hairline veins, subtle depth-of-field bokeh, luxury boutique editorial photography, soft side lighting, 8K quality, no text no letters no numbers',
  },
  {
    emoji: '🌑',
    label: '暗夜商务',
    prompt: 'sophisticated dark luxury business card background, deep space navy-black velvet surface, molten gold Art Deco geometric line patterns glowing softly, champagne micro-bokeh particles suspended in air, cinematic rim lighting, Rolls-Royce editorial quality, no text no letters',
  },
  {
    emoji: '⚡',
    label: '赛博朋克',
    prompt: 'cyberpunk noir business card background, rain-slicked neon-lit Tokyo alley at 3AM, holographic purple and electric cyan light reflections on wet asphalt, lens flare, chromatic aberration, volumetric fog, Blade Runner 2049 cinematography, ultra-detailed, no text no letters',
  },
  {
    emoji: '🌸',
    label: '动漫清新',
    prompt: 'ethereal pastel anime business card background, enchanted sakura forest at golden sunrise, thousands of pink cherry blossom petals floating in soft glowing morning light, watercolor wash sky in peach and lavender, Studio Ghibli hand-painted dreamscape, no text no letters',
  },
  {
    emoji: '🔥',
    label: '动漫炫酷',
    prompt: 'explosive anime power business card background, transcendent golden sacred energy aura bursting outward, crackling white-hot lightning bolts, radial speed lines, roaring crimson flames at edges, Dragon Ball Super ultra instinct transformation, hyper-detailed shading, no text no letters',
  },
  {
    emoji: '🏯',
    label: '国风水墨',
    prompt: 'masterpiece Chinese ink wash painting business card background, towering misty karst mountain peaks emerging from sea of clouds, ancient gnarled pine tree silhouette, distant pagoda, delicate red seal stamp accent, rice paper texture with aged patina, Song dynasty scholar aesthetic, museum archival quality, no text no letters',
  },
  {
    emoji: '✨',
    label: '奢华金箔',
    prompt: 'ultra exclusive luxury business card background, matte obsidian black surface with hand-pressed genuine 24K gold foil abstract geometric flourishes, fine champagne gold micro-texture, deep shadows and metallic highlights, Hermès and Bottega Veneta level craftsmanship, no text no letters',
  },
  {
    emoji: '🔬',
    label: '科技电路',
    prompt: 'futuristic quantum AI technology business card background, deep void black with luminous sapphire-blue neural network circuits pulsing with flowing data streams, holographic HUD readout rings, particle energy nodes, silicon valley hyperscaler aesthetic, no text no letters',
  },
  {
    emoji: '🌈',
    label: '极光梦幻',
    prompt: 'transcendent aurora borealis business card background, swirling emerald jade and deep violet celestial light curtains dancing above pristine arctic snow field, star trails arcing across the Milky Way, infinite cosmos depth, ice crystal foreground bokeh, National Geographic photography, no text no letters',
  },
  {
    emoji: '🌿',
    label: '自然水彩',
    prompt: 'exquisite botanical watercolor illustration business card background, lush tropical monstera and palm leaves in jade and emerald, white moonflower blossoms with delicate veins, fresh morning dew drops catching light, impressionist brushwork, florist atelier aesthetic, no text no letters',
  },
]

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    store.setField('avatarUrl', ev.target?.result as string)
  }
  reader.readAsDataURL(file)
}

function toggleLayout(id: string) {
  const idx = selectedLayouts.value.indexOf(id)
  if (idx === -1) {
    selectedLayouts.value.push(id)
  } else if (selectedLayouts.value.length > 1) {
    // 至少保留一种
    selectedLayouts.value.splice(idx, 1)
  }
}

// 布局缩略图样式计算
function getThumbStyle(layout: LayoutConfig) {
  const isVertical = parseInt(layout.cardSize.height) > parseInt(layout.cardSize.width)
  return {
    width: isVertical ? '44px' : '72px',
    height: isVertical ? '72px' : '44px',
  }
}

function getThumbAvatarStyle(layout: LayoutConfig) {
  const isCenter = layout.avatarPosition.translateX === '-50%'
  const isRight = !!layout.avatarPosition.right && !layout.avatarPosition.left
  const isVertical = parseInt(layout.cardSize.height) > parseInt(layout.cardSize.width)

  if (isCenter && isVertical) {
    return { top: '6px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px' }
  }
  if (isCenter) {
    return { top: '6px', left: '50%', transform: 'translateX(-50%)', width: '14px', height: '14px' }
  }
  if (isRight) {
    return { top: '6px', right: '6px', width: '16px', height: '16px' }
  }
  return { top: '6px', left: '6px', width: '16px', height: '16px' }
}

function getThumbLinesStyle(layout: LayoutConfig) {
  const isCenter = layout.avatarPosition.translateX === '-50%'
  const isRight = !!layout.avatarPosition.right && !layout.avatarPosition.left
  const isVertical = parseInt(layout.cardSize.height) > parseInt(layout.cardSize.width)

  if (isCenter || isVertical) {
    return { top: '26px', left: '8px', right: '8px', alignItems: 'center' }
  }
  if (isRight) {
    return { top: '8px', left: '8px', right: '28px' }
  }
  return { top: '8px', left: '28px', right: '8px' }
}

async function generate() {
  errorMsg.value = ''
  if (!store.fields.name.trim()) {
    errorMsg.value = '请填写姓名'
    return
  }
  if (!customPrompt.value.trim()) {
    errorMsg.value = '请填写背景提示词，或点击快捷风格选择'
    return
  }
  const provider = localStorage.getItem('ai_provider') || 'pollinations'
  if (provider !== 'pollinations' && !localStorage.getItem('ai_api_key')?.trim()) {
    errorMsg.value = '请先在设置页配置 API Key'
    return
  }

  store.isGenerating = true
  const imageSize = localStorage.getItem('ai_image_size') || '512x512'
  const activeLyt = layouts.filter((l) => selectedLayouts.value.includes(l.id))

  store.setGeneratedCards(
    activeLyt.map((l) => ({
      layoutId: l.id,
      backgroundUrl: '',
      loading: true,
      error: '',
    })),
  )

  // 并行请求：用户提示词 + 布局结构词，每张独立生成
  const tasks = activeLyt.map(async (layout) => {
    const prompt = `${customPrompt.value.trim()}, ${layout.structuralKeyword}, no text, no words, no letters, high quality`
    try {
      const url = await generateImage({ prompt, size: imageSize })
      store.updateCard(layout.id, { backgroundUrl: url, loading: false })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '生成失败'
      store.updateCard(layout.id, { loading: false, error: msg })
    }
  })

  await Promise.allSettled(tasks)
  store.isGenerating = false
  router.push('/preview')
}
</script>

<style scoped>
.home-page {
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
}
.logo {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
}
.settings-btn {
  background: #f0f0ff;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13px;
  color: #6366f1;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.settings-btn:hover { background: #e0e0ff; }

.content {
  padding: 20px 16px 40px;
  max-width: 480px;
  margin: 0 auto;
}

.section {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 4px;
}
.section-sub {
  font-size: 12px;
  color: #aaa;
  margin: 0 0 12px;
}

/* 头像 */
.avatar-upload {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2.5px dashed #c4c4f0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafe;
  transition: border-color 0.2s;
  margin: 0 auto;
}
.avatar-upload:hover { border-color: #6366f1; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #aaa; font-size: 11px; }
.avatar-icon { font-size: 24px; }

/* 表单 */
.form { display: flex; flex-direction: column; gap: 14px; }
.form-item label { display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 5px; }
.input {
  width: 100%;
  border: 1.5px solid #e8e8f4;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: #1a1a2e;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: #fafafe;
}
.input:focus { border-color: #6366f1; }

/* 提示词 */
.prompt-input {
  width: 100%;
  border: 1.5px solid #e8e8f4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 13px;
  color: #1a1a2e;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: #fafafe;
  resize: vertical;
  line-height: 1.6;
  font-family: inherit;
}
.prompt-input:focus { border-color: #6366f1; }

.preset-label {
  font-size: 11px;
  color: #aaa;
  margin: 10px 0 8px;
  font-weight: 600;
}
.preset-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.preset-btn {
  background: #f5f5ff;
  border: 1.5px solid #e0e0f8;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.preset-btn:hover { border-color: #6366f1; color: #6366f1; background: #ededff; }
.preset-btn.active { border-color: #6366f1; background: #6366f1; color: #fff; }

/* 布局模板 */
.layout-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.layout-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid #e8e8f4;
  transition: border-color 0.2s, background 0.2s;
}
.layout-item:hover { border-color: #c4c4f0; }
.layout-item.active { border-color: #6366f1; background: #f8f8ff; }

.layout-check {
  position: absolute;
  top: 5px;
  right: 7px;
  font-size: 11px;
  color: #6366f1;
  font-weight: 700;
}

.layout-thumb {
  position: relative;
  background: linear-gradient(135deg, #e8e8f8, #d0d0f0);
  border-radius: 6px;
  overflow: hidden;
}

.thumb-avatar {
  position: absolute;
  background: #a0a0d0;
  border-radius: 50%;
}

.thumb-lines {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.thumb-line {
  height: 3px;
  background: #a0a0d0;
  border-radius: 2px;
  width: 100%;
}
.thumb-line.thick { height: 4px; background: #7070b0; }
.thumb-line.short { width: 60%; }

.layout-name {
  font-size: 11px;
  color: #555;
  font-weight: 600;
}

/* 按钮 */
.error-tip {
  background: #fff0f0;
  border-radius: 10px;
  padding: 10px 14px;
  color: #e53e3e;
  font-size: 13px;
  margin-bottom: 12px;
}
.generate-btn {
  width: 100%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 15px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}
.generate-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
  margin-right: 6px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.bottom-tip {
  text-align: center;
  font-size: 12px;
  color: #aaa;
  margin-top: 10px;
}
</style>
