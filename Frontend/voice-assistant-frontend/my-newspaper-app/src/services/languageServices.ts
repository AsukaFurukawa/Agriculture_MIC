// src/services/languageService.ts

export async function detectLanguage() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/language/detect`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await res.json()
      return data.language || 'English'
    } catch (err) {
      console.error('Error detecting language:', err)
      return 'English' // fallback
    }
  }
  
  export async function setLanguage(language: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/language/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ language }),
      })
      return await res.json()
    } catch (err) {
      console.error('Error setting language:', err)
      return null
    }
  }
  