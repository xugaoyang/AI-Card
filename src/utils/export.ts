import html2canvas from 'html2canvas'

export async function exportCardAsPng(el: HTMLElement, filename = 'business-card.png') {
  // 等待所有图片加载完毕
  const imgs = el.querySelectorAll('img')
  await Promise.all(
    Array.from(imgs).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
          } else {
            img.onload = () => resolve()
            img.onerror = () => resolve()
          }
        }),
    ),
  )

  const canvas = await html2canvas(el, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    scale: 2,
    logging: false,
  })

  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}
