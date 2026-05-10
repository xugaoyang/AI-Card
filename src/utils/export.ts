import html2canvas from 'html2canvas'

/** 将跨域图片 URL 转为 base64 data URL，解决 html2canvas 跨域渲染问题 */
async function toBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url, { mode: 'cors' })
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return url
  }
}

/** 将元素内所有跨域 img 替换为 base64，渲染完后还原 */
async function replaceImgsWithBase64(el: HTMLElement): Promise<() => void> {
  const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'))
  const origSrcs: string[] = []

  await Promise.all(
    imgs.map(async (img, i) => {
      origSrcs[i] = img.src
      if (img.src && !img.src.startsWith('data:')) {
        img.src = await toBase64(img.src)
      }
    }),
  )

  return () => {
    imgs.forEach((img, i) => {
      img.src = origSrcs[i]
    })
  }
}

export async function exportCardAsPng(el: HTMLElement, filename = 'business-card.png') {
  const restore = await replaceImgsWithBase64(el)

  try {
    const canvas = await html2canvas(el, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      imageTimeout: 0,
    })

    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally {
    restore()
  }
}
