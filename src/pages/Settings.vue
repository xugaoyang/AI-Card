<template>
  <div class="settings-page">
    <div class="header">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <h1>API 设置</h1>
    </div>

    <!-- 服务商选择 -->
    <div class="card">
      <h2 class="card-title">选择图像生成服务</h2>
      <div class="provider-list">
        <div
          v-for="preset in PROVIDER_PRESETS"
          :key="preset.id"
          class="provider-item"
          :class="{ active: provider === preset.id }"
          @click="selectPreset(preset)"
        >
          <div class="provider-header">
            <span class="provider-name">{{ preset.name }}</span>
            <span :class="preset.badge === 'free' ? 'badge-free' : 'badge-paid'">
              {{ preset.badge === 'free' ? '免费' : '付费' }}
            </span>
          </div>
          <p class="provider-desc">{{ preset.desc }}</p>
          <a
            v-if="preset.registerUrl"
            :href="preset.registerUrl"
            target="_blank"
            class="provider-link"
            @click.stop
          >点此注册领取免费额度 ↗</a>
        </div>
      </div>
    </div>

    <!-- Pollinations 配置 -->
    <div v-if="provider === 'pollinations'" class="card">
      <div class="tip tip-green">
        ✅ Pollinations.ai 完全免费，无需 API Key，直接使用。国内网络访问较慢，请耐心等待（约 20~40 秒）。
      </div>
      <div class="form-group">
        <label>图像尺寸</label>
        <select v-model="imageSize" class="input">
          <option value="512x512">512×512（推荐）</option>
          <option value="768x512">768×512（横版）</option>
          <option value="512x768">512×768（竖版）</option>
          <option value="1024x1024">1024×1024（高清，较慢）</option>
        </select>
      </div>
      <button class="save-btn" @click="save">保存设置</button>
      <div v-if="saved" class="success-msg">✅ 已保存</div>
    </div>

    <!-- 硅基流动配置 -->
    <div v-else-if="provider === 'siliconflow'" class="card">
      <div class="tip tip-blue">
        🚀 硅基流动国内可直连，速度快。注册后在
        <a href="https://cloud.siliconflow.cn/account/ak" target="_blank">控制台</a>
        创建 API Key 填入下方。免费模型每天有额度，够日常使用。
      </div>
      <div class="form-group">
        <label>API Key</label>
        <div class="input-wrap">
          <input
            v-model="apiKey"
            :type="showKey ? 'text' : 'password'"
            placeholder="sk-..."
            class="input"
          />
          <button class="eye-btn" @click="showKey = !showKey">
            {{ showKey ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>模型</label>
        <select v-model="model" class="input">
          <option value="Kwai-Kolors/Kolors">Kolors（免费，推荐）</option>
          <option value="black-forest-labs/FLUX.1-schnell">FLUX.1-schnell（免费，极快）</option>
          <option value="stabilityai/stable-diffusion-xl-base-1.0">SDXL（免费）</option>
        </select>
      </div>
      <div class="form-group">
        <label>图像尺寸</label>
        <select v-model="imageSize" class="input">
          <option value="1024x1024">1024×1024（推荐）</option>
          <option value="960x1280">960×1280（竖版）</option>
          <option value="768x1024">768×1024（竖版小）</option>
          <option value="720x1280">720×1280（9:16）</option>
        </select>
      </div>
      <button class="save-btn" @click="save">保存设置</button>
      <div v-if="saved" class="success-msg">✅ 已保存</div>
    </div>

    <!-- 智谱 AI 配置 -->
    <div v-else-if="provider === 'zhipu'" class="card">
      <div class="tip tip-blue">
        🧠 智谱 AI 国内直连，注册即赠免费额度。在
        <a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank">控制台</a>
        创建 API Key 填入下方。
      </div>
      <div class="form-group">
        <label>API Key</label>
        <div class="input-wrap">
          <input
            v-model="apiKey"
            :type="showKey ? 'text' : 'password'"
            placeholder="填入智谱 API Key"
            class="input"
          />
          <button class="eye-btn" @click="showKey = !showKey">
            {{ showKey ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>模型</label>
        <select v-model="model" class="input">
          <option value="cogview-3-flash">CogView-3-Flash（免费额度，速度快）</option>
          <option value="cogview-3-plus">CogView-3-Plus（付费，质量更高）</option>
        </select>
      </div>
      <div class="form-group">
        <label>图像尺寸</label>
        <select v-model="imageSize" class="input">
          <option value="1024x1024">1024×1024</option>
        </select>
      </div>
      <button class="save-btn" @click="save">保存设置</button>
      <div v-if="saved" class="success-msg">✅ 已保存</div>
    </div>

    <!-- 自定义 OpenAI 兼容接口配置 -->
    <div v-else class="card">
      <div class="tip">
        💡 填写兼容 OpenAI 格式的图像生成接口，Base URL 不含路径，如 https://api.openai.com
      </div>
      <div class="form-group">
        <label>API Base URL</label>
        <input v-model="baseURL" type="text" placeholder="https://api.openai.com" class="input" />
      </div>
      <div class="form-group">
        <label>API Key</label>
        <div class="input-wrap">
          <input
            v-model="apiKey"
            :type="showKey ? 'text' : 'password'"
            placeholder="sk-..."
            class="input"
          />
          <button class="eye-btn" @click="showKey = !showKey">
            {{ showKey ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>模型名称</label>
        <input v-model="model" type="text" placeholder="dall-e-3" class="input" />
      </div>
      <div class="form-group">
        <label>图像尺寸</label>
        <select v-model="imageSize" class="input">
          <option value="256x256">256×256（快速）</option>
          <option value="512x512">512×512（推荐）</option>
          <option value="1024x1024">1024×1024（高清）</option>
        </select>
      </div>
      <button class="save-btn" @click="save">保存设置</button>
      <div v-if="saved" class="success-msg">✅ 已保存</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PROVIDER_PRESETS } from '@/api/aiImage'
import type { Provider, ProviderPreset } from '@/api/aiImage'

const router = useRouter()
const provider = ref<Provider>('pollinations')
const baseURL = ref('https://api.openai.com')
const apiKey = ref('')
const model = ref('flux')
const imageSize = ref('512x512')
const showKey = ref(false)
const saved = ref(false)

onMounted(() => {
  provider.value = (localStorage.getItem('ai_provider') as Provider) || 'pollinations'
  baseURL.value = localStorage.getItem('ai_base_url') || 'https://api.openai.com'
  apiKey.value = localStorage.getItem('ai_api_key') || ''
  model.value = localStorage.getItem('ai_model') || 'flux'
  imageSize.value = localStorage.getItem('ai_image_size') || '512x512'
})

function selectPreset(preset: ProviderPreset) {
  provider.value = preset.id
  if (preset.baseURL) baseURL.value = preset.baseURL
  model.value = preset.model
  imageSize.value = preset.sizes[0]
}

function save() {
  localStorage.setItem('ai_provider', provider.value)
  localStorage.setItem('ai_base_url', baseURL.value.trim())
  localStorage.setItem('ai_api_key', apiKey.value.trim())
  localStorage.setItem('ai_model', model.value.trim())
  localStorage.setItem('ai_image_size', imageSize.value)
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f5f6fa;
  padding: 0 0 40px;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #6366f1;
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
}
.back-btn:hover { background: #f0f0ff; }

h1 {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin: 0 16px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 14px;
}

.provider-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.provider-item {
  border: 2px solid #e8e8f4;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.provider-item:hover { border-color: #c4c4f0; }
.provider-item.active { border-color: #6366f1; background: #f8f8ff; }

.provider-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.provider-name {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}

.badge-free {
  background: #dcfce7;
  color: #16a34a;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}

.badge-paid {
  background: #fef3c7;
  color: #b45309;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}

.provider-desc {
  font-size: 12px;
  color: #777;
  margin: 4px 0 6px;
  line-height: 1.5;
}

.provider-link {
  font-size: 11px;
  color: #6366f1;
  text-decoration: none;
}
.provider-link:hover { text-decoration: underline; }

.tip {
  background: #f0f0ff;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13px;
  color: #5c5c8a;
  margin-bottom: 18px;
  line-height: 1.6;
}
.tip a { color: #6366f1; }

.tip-green {
  background: #f0fdf4;
  color: #166534;
}

.tip-blue {
  background: #eff6ff;
  color: #1e40af;
}
.tip-blue a { color: #2563eb; }

.form-group { margin-bottom: 18px; }

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
}

.input {
  width: 100%;
  border: 1.5px solid #e0e0f0;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: #1a1a2e;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: #fafafe;
  font-family: inherit;
}
.input:focus { border-color: #6366f1; }

.input-wrap { position: relative; }
.input-wrap .input { padding-right: 60px; }
.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #6366f1;
}

.save-btn {
  width: 100%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 13px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.save-btn:hover { opacity: 0.9; }

.success-msg {
  text-align: center;
  color: #22c55e;
  font-size: 14px;
  margin-top: 12px;
}
</style>
