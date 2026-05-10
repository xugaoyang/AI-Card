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
    letterSpacing?: string
  }
  infoStyle: {
    fontSize: string
    color: string
    lightColor: string
    lineHeight: string
    letterSpacing?: string
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
    structuralKeyword: 'wide horizontal business card, left portrait right content layout, premium editorial style',
    avatarPosition: {
      top: '36px',
      left: '36px',
      size: '76px',
      shape: 'circle',
    },
    contentArea: {
      top: '36px',
      left: '136px',
      right: '28px',
      padding: '0',
      textAlign: 'left',
    },
    nameStyle: {
      fontSize: '22px',
      fontWeight: '800',
      color: '#1a1a2e',
      lightColor: '#ffffff',
      marginBottom: '10px',
      letterSpacing: '0.02em',
    },
    infoStyle: {
      fontSize: '12px',
      color: '#4a4a6a',
      lightColor: 'rgba(255,255,255,0.88)',
      lineHeight: '2.1',
      letterSpacing: '0.01em',
    },
    cardSize: { width: '420px', height: '240px' },
    overlay: 'rgba(255,255,255,0.52)',
    overlayDark: 'rgba(10,10,30,0.50)',
  },
  {
    id: 'darkpro',
    name: '横版右像',
    structuralKeyword: 'wide horizontal business card, text on left portrait circle on right, dramatic lighting',
    avatarPosition: {
      top: '30px',
      right: '32px',
      size: '84px',
      shape: 'circle',
    },
    contentArea: {
      top: '30px',
      left: '32px',
      right: '140px',
      padding: '0',
      textAlign: 'left',
    },
    nameStyle: {
      fontSize: '22px',
      fontWeight: '800',
      color: '#1a1a2e',
      lightColor: '#ffffff',
      marginBottom: '10px',
      letterSpacing: '0.02em',
    },
    infoStyle: {
      fontSize: '12px',
      color: '#4a4a6a',
      lightColor: 'rgba(255,255,255,0.88)',
      lineHeight: '2.1',
      letterSpacing: '0.01em',
    },
    cardSize: { width: '420px', height: '240px' },
    overlay: 'rgba(255,255,255,0.52)',
    overlayDark: 'rgba(10,10,30,0.50)',
  },
  {
    id: 'creative',
    name: '横版居中',
    structuralKeyword: 'wide horizontal business card, centered symmetrical composition, elegant balanced layout',
    avatarPosition: {
      top: '30px',
      left: '50%',
      translateX: '-50%',
      size: '72px',
      shape: 'circle',
    },
    contentArea: {
      top: '118px',
      left: '0',
      right: '0',
      padding: '0 20px',
      textAlign: 'center',
    },
    nameStyle: {
      fontSize: '22px',
      fontWeight: '800',
      color: '#1a1a2e',
      lightColor: '#ffffff',
      marginBottom: '8px',
      letterSpacing: '0.06em',
    },
    infoStyle: {
      fontSize: '11px',
      color: '#4a4a6a',
      lightColor: 'rgba(255,255,255,0.9)',
      lineHeight: '2.0',
      letterSpacing: '0.03em',
    },
    cardSize: { width: '420px', height: '240px' },
    overlay: 'rgba(255,255,255,0.52)',
    overlayDark: 'rgba(10,10,30,0.50)',
  },
  {
    id: 'classic',
    name: '竖版经典',
    structuralKeyword: 'tall vertical portrait business card, centered layout with elegant spacing',
    avatarPosition: {
      top: '36px',
      left: '50%',
      translateX: '-50%',
      size: '80px',
      shape: 'rounded',
    },
    contentArea: {
      top: '132px',
      left: '0',
      right: '0',
      padding: '0 20px',
      textAlign: 'center',
    },
    nameStyle: {
      fontSize: '20px',
      fontWeight: '800',
      color: '#1a1a2e',
      lightColor: '#ffffff',
      marginBottom: '10px',
      letterSpacing: '0.04em',
    },
    infoStyle: {
      fontSize: '11px',
      color: '#4a4a6a',
      lightColor: 'rgba(255,255,255,0.9)',
      lineHeight: '2.1',
      letterSpacing: '0.02em',
    },
    cardSize: { width: '260px', height: '420px' },
    overlay: 'rgba(255,255,255,0.52)',
    overlayDark: 'rgba(10,10,30,0.50)',
  },
  {
    id: 'banner',
    name: '横版底栏',
    structuralKeyword: 'wide horizontal business card, full bleed background image, info text band at bottom',
    avatarPosition: {
      bottom: '24px',
      left: '28px',
      size: '64px',
      shape: 'circle',
    },
    contentArea: {
      bottom: '0',
      left: '0',
      right: '0',
      padding: '18px 20px 20px 108px',
      textAlign: 'left',
    },
    nameStyle: {
      fontSize: '20px',
      fontWeight: '800',
      color: '#1a1a2e',
      lightColor: '#ffffff',
      marginBottom: '4px',
      letterSpacing: '0.02em',
    },
    infoStyle: {
      fontSize: '11px',
      color: '#4a4a6a',
      lightColor: 'rgba(255,255,255,0.85)',
      lineHeight: '1.8',
      letterSpacing: '0.01em',
    },
    cardSize: { width: '420px', height: '240px' },
    overlay: 'linear-gradient(to bottom, rgba(255,255,255,0) 40%, rgba(255,255,255,0.92) 100%)',
    overlayDark: 'linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,0.82) 100%)',
  },
  {
    id: 'vertical2',
    name: '竖版分割',
    structuralKeyword: 'tall vertical business card, top half full bleed image bottom half clean content area',
    avatarPosition: {
      top: '130px',
      left: '50%',
      translateX: '-50%',
      size: '72px',
      shape: 'circle',
    },
    contentArea: {
      top: '218px',
      left: '0',
      right: '0',
      padding: '0 20px',
      textAlign: 'center',
    },
    nameStyle: {
      fontSize: '19px',
      fontWeight: '800',
      color: '#1a1a2e',
      lightColor: '#ffffff',
      marginBottom: '8px',
      letterSpacing: '0.04em',
    },
    infoStyle: {
      fontSize: '11px',
      color: '#4a4a6a',
      lightColor: 'rgba(255,255,255,0.9)',
      lineHeight: '2.0',
      letterSpacing: '0.02em',
    },
    cardSize: { width: '260px', height: '420px' },
    overlay: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.96) 62%)',
    overlayDark: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 45%, rgba(10,10,30,0.94) 62%)',
  },
]
