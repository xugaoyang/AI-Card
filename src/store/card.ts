import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export interface CardFields {
  name: string
  phone: string
  address: string
  wechat: string
  avatarUrl: string
}

export interface GeneratedCard {
  layoutId: string
  backgroundUrl: string
  loading: boolean
  error: string
}

export const useCardStore = defineStore('card', () => {
  const fields = reactive<CardFields>({
    name: '',
    phone: '',
    address: '',
    wechat: '',
    avatarUrl: '',
  })

  const generatedCards = ref<GeneratedCard[]>([])
  const isGenerating = ref(false)
  const selectedThemeId = ref('business')
  /** 文字是否用亮色（深色背景时开启） */
  const lightText = ref(false)

  function setField<K extends keyof CardFields>(key: K, value: CardFields[K]) {
    fields[key] = value
  }

  function setGeneratedCards(cards: GeneratedCard[]) {
    generatedCards.value = cards
  }

  function updateCard(layoutId: string, patch: Partial<GeneratedCard>) {
    const idx = generatedCards.value.findIndex((c) => c.layoutId === layoutId)
    if (idx !== -1) {
      generatedCards.value[idx] = { ...generatedCards.value[idx], ...patch }
    }
  }

  function resetCards() {
    generatedCards.value = []
  }

  return {
    fields,
    generatedCards,
    isGenerating,
    selectedThemeId,
    lightText,
    setField,
    setGeneratedCards,
    updateCard,
    resetCards,
  }
})
