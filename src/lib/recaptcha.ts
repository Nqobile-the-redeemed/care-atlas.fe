declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CARE_ATLAS_RECAPTCHA_SITE_KEY
let recaptchaScriptPromise: Promise<void> | null = null

function loadRecaptchaScript() {
  if (!RECAPTCHA_SITE_KEY) {
    return Promise.resolve()
  }

  if (window.grecaptcha) {
    return Promise.resolve()
  }

  if (!recaptchaScriptPromise) {
    recaptchaScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[data-care-atlas-recaptcha]')

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true })
        existingScript.addEventListener('error', () => reject(new Error('reCAPTCHA could not be loaded.')), {
          once: true
        })
        return
      }

      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`
      script.async = true
      script.defer = true
      script.dataset.careAtlasRecaptcha = 'true'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('reCAPTCHA could not be loaded.'))
      document.head.appendChild(script)
    })
  }

  return recaptchaScriptPromise
}

export async function getRecaptchaToken(action: string) {
  if (!RECAPTCHA_SITE_KEY) {
    return null
  }

  await loadRecaptchaScript()

  if (!window.grecaptcha) {
    throw new Error('reCAPTCHA is unavailable. Please refresh and try again.')
  }

  return new Promise<string>((resolve, reject) => {
    window.grecaptcha?.ready(() => {
      window.grecaptcha
        ?.execute(RECAPTCHA_SITE_KEY, { action })
        .then(resolve)
        .catch(() => reject(new Error('reCAPTCHA verification could not start.')))
    })
  })
}
