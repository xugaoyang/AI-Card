import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  theme: {
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
    },
  },
})
