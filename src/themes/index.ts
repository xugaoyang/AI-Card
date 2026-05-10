export interface Theme {
  id: string
  name: string
  emoji: string
  /** 用于 CSS 渐变预览色块 */
  previewGradient: string
  /** 风格核心提示词（英文，效果最佳） */
  prompt: string
  /** 文字颜色是否需要亮色（深色背景时） */
  lightText: boolean
}

export const themes: Theme[] = [
  {
    id: 'business',
    name: '商业简约',
    emoji: '💼',
    previewGradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    prompt:
      'elegant business card background, polished white marble texture with subtle gold veins, luxury minimalist design, soft shadows, premium feel',
    lightText: false,
  },
  {
    id: 'darkbiz',
    name: '暗夜商务',
    emoji: '🌑',
    previewGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    prompt:
      'premium dark business card background, deep space navy black with glowing gold geometric lines, luxury metallic sheen, bokeh light particles, professional',
    lightText: true,
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    emoji: '⚡',
    previewGradient: 'linear-gradient(135deg, #0d0221 0%, #7b2ff7 50%, #ff006e 100%)',
    prompt:
      'cyberpunk business card background, neon purple and pink city at night, rain reflections on dark asphalt, holographic glitch effects, futuristic neon glow, blade runner aesthetic',
    lightText: true,
  },
  {
    id: 'anime_soft',
    name: '动漫清新',
    emoji: '🌸',
    previewGradient: 'linear-gradient(135deg, #ffd6e8 0%, #c8f0ff 100%)',
    prompt:
      'soft pastel anime business card background, cherry blossom petals falling, dreamy sky in pink and lavender, Studio Ghibli inspired illustration style, gentle watercolor texture',
    lightText: false,
  },
  {
    id: 'anime_epic',
    name: '动漫炫酷',
    emoji: '🔥',
    previewGradient: 'linear-gradient(135deg, #ff4500 0%, #ff8c00 50%, #ffd700 100%)',
    prompt:
      'epic anime business card background, powerful energy aura explosion, vivid orange red gold flames, dynamic speed lines, dragon ball super inspired, anime action art style',
    lightText: true,
  },
  {
    id: 'chinese',
    name: '国风水墨',
    emoji: '🏯',
    previewGradient: 'linear-gradient(135deg, #f5e6d3 0%, #d4915a 100%)',
    prompt:
      'traditional Chinese ink wash painting business card background, misty mountains and pine trees, red seal stamp accent, elegant calligraphy paper texture, Song dynasty art style',
    lightText: false,
  },
  {
    id: 'nature',
    name: '自然水彩',
    emoji: '🌿',
    previewGradient: 'linear-gradient(135deg, #d4edda 0%, #a8e6cf 50%, #88d8b0 100%)',
    prompt:
      'botanical watercolor business card background, soft green leaves and white flowers, delicate hand-painted style, fresh spring nature, light pastel green tones',
    lightText: false,
  },
  {
    id: 'luxury',
    name: '奢华金箔',
    emoji: '✨',
    previewGradient: 'linear-gradient(135deg, #1a0a00 0%, #8B6914 50%, #FFD700 100%)',
    prompt:
      'ultra luxury business card background, black velvet with real gold foil texture, intricate ornamental golden patterns, premium embossed effect, Hermès inspired design',
    lightText: true,
  },
  {
    id: 'tech',
    name: '科技电路',
    emoji: '🔬',
    previewGradient: 'linear-gradient(135deg, #001220 0%, #003366 50%, #0066cc 100%)',
    prompt:
      'futuristic tech business card background, dark background with glowing blue circuit board patterns, data flow lines, microchip grid, holographic HUD interface elements',
    lightText: true,
  },
  {
    id: 'aurora',
    name: '极光梦幻',
    emoji: '🌈',
    previewGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 30%, #a18cd1 60%, #fbc2eb 100%)',
    prompt:
      'aurora borealis business card background, magical northern lights in purple green blue, starry night sky, soft glowing waves, ethereal dreamy atmosphere',
    lightText: true,
  },
]
