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
          class="provider-item"
          :class="{ active: provider === 'pollinations' }"
          @click="provider = 'pollinations'"
        >
          <div class="provider-header">
            <span class="provider-name">🎨 Pollinations.ai</span>
            <span class="badge-free">免费</span>
          </div>
          <p class="provider-desc">完全免费，无需注册和 API Key，适合测试使用</p>
          <a
            href="https://pollinations.ai"
            target="_blank"
            class="provider-link"
            @click.stop
          >pollinations.ai ↗</a>
        </div>

        <div
          class="provider-item"
          :class="{ active: provider === 'openai_compat' }"
          @click="provider = 'openai_compat'"
        >
          <div class="provider-header">
            <span class="provider-name">🔑 OpenAI 兼容接口</span>
            <span class="badge-paid">需 Key</span>
          </div>
          <p class="provider-desc">支持 OpenAI / 智谱 / 硅基流动等兼容接口，效果更佳</p>
        </div>
      </div>
    </div>

    <!-- Pollinations 无需配置 -->
    <div v-if="provider === 'pollinations'" class="card">
      <div class="tip tip-green">
        ✅ Pollinations.ai 无需任何配置，直接返回生成结果。可在下方选择图像尺寸后保存。
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
      <div v-if="saved" class="success-msg">✅ 设置已保存</div>
    </div>

    <!-- OpenAI 兼容接口配置 -->
    <div v-else class="card">
      <div class="tip">
        💡 填写兼容 OpenAI 格式的图像生成接口，支持 OpenAI、智谱、硅基流动等。
      </div>

      <div class="form-group">
        <label>API Base URL</label>
        <input
          v-model="baseURL"
          type="text"
          placeholder="https://api.openai.com"
          class="input"
        />
        <span class="hint">不含路径，如 https://api.openai.com</span>
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
        <label>图像尺寸</label>
        <select v-model="imageSize" class="input">
          <option value="256x256">256×256（快速）</option>
          <option value="512x512">512×512（推荐）</option>
          <option value="1024x1024">1024×1024（高清）</option>
        </select>
      </div>

      <button class="save-btn" @click="save">保存设置</button>
      <div v-if="saved" class="success-msg">✅ 设置已保存</div>

      <!-- 常用服务商参考 -->
      <div class="ref-table">
        <h3>常用服务商配置参考</h3>
        <table>
          <thead>
            <tr>
              <th>服务商</th>
              <th>Base URL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OpenAI</td>
              <td>https://api.openai.com</td>
            </tr>
            <tr>
              <td>智谱 AI</td>
              <td>https://open.bigmodel.cn/api/paas/v4</td>
            </tr>
            <tr>
              <td>硅基流动</td>
              <td>https://api.siliconflow.cn/v1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Provider } from '@/api/aiImage'

const router = useRouter()
const provider = ref<Provider>('pollinations')
const baseURL = ref('https://api.openai.com')
const apiKey = ref('')
const imageSize = ref('512x512')
const showKey = ref(false)
const saved = ref(false)

onMounted(() => {
  provider.value = (localStorage.getItem('ai_provider') as Provider) || 'pollinations'
  baseURL.value = localStorage.getItem('ai_base_url') || 'https://api.openai.com'
  apiKey.value = localStorage.getItem('ai_api_key') || ''
  imageSize.value = localStorage.getItem('ai_image_size') || '512x512'
})

function save() {
  localStorage.setItem('ai_provider', provider.value)
  localStorage.setItem('ai_base_url', baseURL.value.trim())
  localStorage.setItem('ai_api_key', apiKey.value.trim())
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
.back-btn:hover {
  background: #f0f0ff;
}

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
.provider-item:hover {
  border-color: #c4c4f0;
}
.provider-item.active {
  border-color: #6366f1;
  background: #f8f8ff;
}

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
}

.tip {
  background: #f0f0ff;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13px;
  color: #5c5c8a;
  margin-bottom: 18px;
  line-height: 1.6;
}

.tip-green {
  background: #f0fdf4;
  color: #166534;
}

.form-group {
  margin-bottom: 18px;
}

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
}
.input:focus {
  border-color: #6366f1;
}

.input-wrap {
  position: relative;
}
.input-wrap .input {
  padding-right: 60px;
}
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

.hint {
  font-size: 11px;
  color: #aaa;
  margin-top: 4px;
  display: block;
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
.save-btn:hover {
  opacity: 0.9;
}

.success-msg {
  text-align: center;
  color: #22c55e;
  font-size: 14px;
  margin-top: 12px;
}

.ref-table {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f4;
}
.ref-table h3 {
  font-size: 13px;
  font-weight: 600;
  color: #888;
  margin: 0 0 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
th {
  text-align: left;
  color: #888;
  padding: 5px 6px;
  border-bottom: 1px solid #f0f0f0;
}
td {
  padding: 7px 6px;
  border-bottom: 1px solid #f8f8f8;
  color: #555;
  word-break: break-all;
}
</style>
