const configuredNumber = (process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || '447400492608').replace(/\D/g, '')

export const businessNumber = /^\d{10,15}$/.test(configuredNumber) ? configuredNumber : '447400492608'
export const businessPhone = /^44\d{10}$/.test(businessNumber)
  ? `+44 ${businessNumber.slice(2, 6)} ${businessNumber.slice(6)}`
  : `+${businessNumber}`

export function businessWhatsappUrl(message = '') {
  return `https://wa.me/${businessNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
