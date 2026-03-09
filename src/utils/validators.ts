export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 6
}

export function validatePhotoData(data: {
  caption?: string
  alt?: string
  momentDate?: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.caption || data.caption.trim().length === 0) {
    errors.push('Caption is required')
  }

  if (!data.alt || data.alt.trim().length === 0) {
    errors.push('Alt text is required')
  }

  if (!data.momentDate || isNaN(new Date(data.momentDate).getTime())) {
    errors.push('Valid moment date is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function sanitizeString(str: string): string {
  return str.trim().substring(0, 1000)
}
