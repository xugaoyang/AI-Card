export interface LayoutConfig {
  id: string
  name: string
  /** 布局结构描述词，与 theme.prompt 拼合使用 */
  structuralKeyword: string
  avatarPosition: {
    top?: string
    bottom?: string
    left?: string
    right?: string
    translateX?: string
    size: string
    shape: 'circle' | 'rounded' | 'square'
  }
  contentArea: {
    top?: string
    bottom?: string
    left?: string
    right?: string
    padding: string
    textAlign: 'left' | 'center' | 'right'
  }
  nameStyle: {
    fontSize: string
    fontWeight: string
    color: string
    lightColor: string
    marginBottom: string
  }
  infoStyle: {
    fontSize: string
    color: string
    lightColor: string
    lineHeight: string
  }
  cardSize: {
    width: string
    height: string
  }
  overlay: string
  overlayDark: string
}

export const layouts: LayoutConfig[] = [
  {
    id: 'minimal',
    name: '横版左栏',
    structuralKeyword: 'wide horizontal business card, clean layout composition',
    avatarPosition: {
      top: '32px',
      left: '32px',
      size: '72px',
      shape: 'circle',
    },
    contentArea: {
      top: '32px',
      left: '128px',
      right: '24px',
      padding: '0',
      textAlign: 'left',
    },
    nameStyle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1a1a2e',
      lightColor: '#ffffff',
      marginBottom: '8px',
    },
    infoStyle: {
      fontSize: '12px',
      color: '#444',
      lightColor: 'rgba(255,255,255,0.85)',
      lineHeight: '2',
    },
    cardSize: { width: '400px', height: '240px' },
    overlay: 'rgba(255,255,255,0.55)',
    overlayDark: 'rgba(0,0,0,0.45)',
  },
  {
    id: 'darkpro',
    name: '横版右像',
    structuralKeyword: 'wide horizontal business card, portrait on right side',
    avatarPosition: {
      top: '28px',
      right: '28px',
      size: '80px',
      shape: 'circle',
    },
    contentArea: {
      top: '28px',
      left: '28px',
      right: '132px',
      padding: '0',
      textAlign: 'left',
    },
    nameStyle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1a1a2e',
      lightColor: '#ffffff',
      marginBottom: '10px',
    },
    infoStyle: {
      fontSize: '12px',
      color: '#444',
      lightColor: 'rgba(255,255,255,0.85)',
      lineHeight: '2',
    },
    cardSize: { width: '400px', height: '240px' },
    overlay: 'rgba(255,255,255,0.55)',
    overlayDark: 'rgba(0,0,0,0.45)',
  },
  {
    id: 'creative',
    name: '横版居中',
    structuralKeyword: 'wide horizontal business card, centered symmetrical layout',
    avatarPosition: {
      top: '28px',
      left: '50%',
      translateX: '-50%',
      size: '68px',
      shape: 'circle',
    },
    contentArea: {
      top: '116px',
      left: '0',
      right: '0',
      padding: '0 16px',
      textAlign: 'center',
    },
    nameStyle: {
      fontSize: '20px',
      fontWeight: '800',
      color: '#1a1a2e',
      lightColor: '#ffffff',
      marginBottom: '8px',
    },
    infoStyle: {
      fontSize: '11px',
      color: '#444',
      lightColor: 'rgba(255,255,255,0.9)',
      lineHeight: '1.9',
    },
    cardSize: { width: '400px', height: '240px' },
    overlay: 'rgba(255,255,255,0.55)',
    overlayDark: 'rgba(0,0,0,0.45)',
  },
  {
    id: 'classic',
    name: '竖版经典',
    structuralKeyword: 'tall vertical portrait business card, centered layout',
    avatarPosition: {
      top: '32px',
      left: '50%',
      translateX: '-50%',
      size: '76px',
      shape: 'rounded',
    },
    contentArea: {
      top: '124px',
      left: '0',
      right: '0',
      padding: '0 16px',
      textAlign: 'center',
    },
    nameStyle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1a1a2e',
      lightColor: '#ffffff',
      marginBottom: '10px',
    },
    infoStyle: {
      fontSize: '11px',
      color: '#444',
      lightColor: 'rgba(255,255,255,0.9)',
      lineHeight: '2',
    },
    cardSize: { width: '240px', height: '400px' },
    overlay: 'rgba(255,255,255,0.55)',
    overlayDark: 'rgba(0,0,0,0.45)',
  },
]
