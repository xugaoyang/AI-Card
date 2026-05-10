import axios from 'axios'

export interface GenerateImageParams {
  prompt: string
  n?: number
  size?: string
  response_format?: 'url' | 'b64_json'
}

export type Provider = 'pollinations' | 'siliconflow' | 'zhipu' | 'openai_compat'

export interface ProviderPreset {
  id: Provider
  name: string
  badge: 'free' | 'paid'
  desc: string
  baseURL: string
  model: string
  registerUrl?: string
  sizes: string[]
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: 'pollinations',
    name: '🎨 Pollinations.ai',
    badge: 'free',
    desc: '完全免费，无需注册和 API Key，适合快速体验（国内较慢）',
    baseURL: '',
    model: 'flux',
    sizes: ['512x512', '768x512', '512x768', '1024x1024'],
  },
  {
    id: 'siliconflow',
    name: '🚀 硅基流动',
    badge: 'free',
    desc: '国内可直连，注册即送免费额度，速度快，效果优秀',
    baseURL: 'https://api.siliconflow.cn/v1',
    model: 'Kwai-Kolors/Kolors',
    registerUrl: 'https://cloud.siliconflow.cn/i/free',
    sizes: ['1024x1024', '960x1280', '768x1024', '720x1280'],
  },
  {
    id: 'zhipu',
    name: '🧠 智谱 AI',
    badge: 'free',
    desc: '国内直连，注册赠免费额度，CogView 图像质量好',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'cogview-3-flash',
    registerUrl: 'https://open.bigmodel.cn',
    sizes: ['1024x1024'],
  },
  {
    id: 'openai_compat',
    name: '🔑 自定义 OpenAI 兼容接口',
    badge: 'paid',
    desc: '支持 OpenAI、其他兼容接口，自行填写 Base URL 和 Key',
    baseURL: 'https://api.openai.com',
    model: 'dall-e-3',
    sizes: ['256x256', '512x512', '1024x1024'],
  },
]

export function getApiConfig() {
  const provider = (localStorage.getItem('ai_provider') || 'pollinations') as Provider
  const preset = PROVIDER_PRESETS.find((p) => p.id === provider) || PROVIDER_PRESETS[0]
  return {
    provider,
    baseURL: localStorage.getItem('ai_base_url') || preset.baseURL,
    apiKey: localStorage.getItem('ai_api_key') || '',
    model: localStorage.getItem('ai_model') || preset.model,
    imageSize: localStorage.getItem('ai_image_size') || preset.sizes[0],
  }
}

/** Pollinations.ai - 直接返回图片 URL */
function buildPollinationsUrl(prompt: string, size: string): string {
  const [w, h] = size.split('x').map(Number)
  const width = w || 512
  const height = h || 512
  const encoded = encodeURIComponent(prompt)
  const seed = Math.floor(Math.random() * 999999)
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}&model=flux`
}

/** 硅基流动专用接口（参数格式与 OpenAI 不同） */
async function generateViaSiliconFlow(params: GenerateImageParams): Promise<string> {
  const { apiKey, model, imageSize } = getApiConfig()

  if (!apiKey) throw new Error('请先在设置页填写 API Key')

  const response = await axios.post<{ images: { url: string }[] }>(
    'https://api.siliconflow.cn/v1/images/generations',
    {
      model,
      prompt: params.prompt,
      image_size: params.size ?? imageSize,
      batch_size: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    },
  )

  return response.data.images?.[0]?.url || ''
}

/** 智谱 / OpenAI 标准兼容接口 */
async function generateViaOpenAICompat(params: GenerateImageParams): Promise<string> {
  const { baseURL, apiKey, model, imageSize } = getApiConfig()

  if (!apiKey) throw new Error('请先在设置页填写 API Key')

  const url = baseURL.endsWith('/v1')
    ? `${baseURL}/images/generations`
    : `${baseURL}/v1/images/generations`

  const response = await axios.post<{ data: { url?: string; b64_json?: string }[] }>(
    url,
    {
      model,
      prompt: params.prompt,
      n: params.n ?? 1,
      size: params.size ?? imageSize,
      response_format: params.response_format ?? 'url',
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    },
  )

  const result = response.data.data[0]
  if (result.b64_json) return `data:image/png;base64,${result.b64_json}`
  return result.url || ''
}

export async function generateImage(params: GenerateImageParams): Promise<string> {
  const { provider, imageSize } = getApiConfig()

  if (provider === 'pollinations') {
    return buildPollinationsUrl(params.prompt, params.size ?? imageSize)
  }

  if (provider === 'siliconflow') {
    return generateViaSiliconFlow(params)
  }

  return generateViaOpenAICompat(params)
}
