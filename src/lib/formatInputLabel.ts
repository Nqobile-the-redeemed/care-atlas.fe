export function formatInputLabel(label?: string) {
  const trimmed = label?.trim() ?? ''

  if (!trimmed) return trimmed

  let wordIndex = 0

  return trimmed.replace(/[A-Za-z]+(?:'[A-Za-z]+)*/g, word => {
    const shouldPreserveAcronym = /^[A-Z]{2,4}$/.test(word)

    if (shouldPreserveAcronym) {
      wordIndex += 1
      return word
    }

    const lower = word.toLowerCase()
    const formatted = wordIndex === 0 ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower

    wordIndex += 1
    return formatted
  })
}
