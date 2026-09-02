export function randomBlueShade(): string {
  const start = hexToRgb('#1E88E5')
  const end = hexToRgb('#64B5F6')

  const t = Math.random()

  const r = Math.round(start.r + (end.r - start.r) * t)
  const g = Math.round(start.g + (end.g - start.g) * t)
  const b = Math.round(start.b + (end.b - start.b) * t)

  return rgbToHex(r, g, b)
}

export function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex)

  const [R, G, B] = [r, g, b].map(v => {
    const c = v / 255

    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })

  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B

  return luminance > 0.179 ? '#000000' : '#FFFFFF'
}

function hexToRgb(hex: string) {
  const sanitized = hex.replace('#', '')
  const bigint = parseInt(sanitized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}
