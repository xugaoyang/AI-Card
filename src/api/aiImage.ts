import axios from 'axios'

export interface GenerateImageParams {
  prompt: string
  n?: number
  size?: string
  response_format?: 'url' | 'b64_json'
}

export type Provider = 'pollinations' | 'openai_compat'

export function getApiConfig() {
  return {
    provider: (localStorage.getItem('ai_provider') || 'pollinations') as Provider,
    baseURL: localStorage.getItem('ai_base_url') || 'https://api.openai.com',
    apiKey: localStorage.getItem('ai_api_key') || '',
    imageSize: localStorage.getItem('ai_image_size') || '512x512',
  }
}

/** Pollinations.ai - 直接返回图片 URL，浏览器原生加载，无 fetch 中间层 */
function buildPollinationsUrl(prompt: string, size: string): string {
  const [w, h] = size.split('x').map(Number)
  const width = w || 512
  const height = h || 512
  const encoded = encodeURIComponent(prompt)
  const seed = Math.floor(Math.random() * 999999)
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}&model=flux`
}

/** OpenAI 兼容接口（OpenAI / 智谱 / 硅基流动等） */
async function generateViaOpenAICompat(params: GenerateImageParams): Promise<string> {
  const { baseURL, apiKey, imageSize } = getApiConfig()

  if (!apiKey) {
    throw new Error('请先在设置页填写 API Key')
  }

  const response = await axios.post<{ data: { url?: string; b64_json?: string }[] }>(
    `${baseURL}/v1/images/generations`,
    {
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
    },
  )

  const result = response.data.data[0]
  if (result.b64_json) {
    return `data:image/png;base64,${result.b64_json}`
  }
  return result.url || ''
}

export async function generateImage(params: GenerateImageParams): Promise<string> {
  const { provider, imageSize } = getApiConfig()

  if (provider === 'pollinations') {
    // Pollinations 直接返回 URL，img 标签会等待图片生成完毕后自动加载
    return buildPollinationsUrl(params.prompt, params.size ?? imageSize)
  }

  return generateViaOpenAICompat(params)
}
