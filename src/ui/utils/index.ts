import { useCallback, useRef } from "react"

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = ('0' + date.getUTCDate()).slice(-2) 
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
    const year = date.getUTCFullYear()

    return `${day}.${month}.${year}`
}

export function clampText(text: string, limit: number) {
  if (text.length > limit) {
    return text.slice(0, limit).concat('...')
  }

  return text
}

export function base64FromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.onerror = (error) => {
      reject(error)
    }
    
    reader.readAsDataURL(file)
  })
}

export function debounce<T extends any[]>(
  func: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout | null

  return function(this: any, ...args: T) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
      timeoutId = null
    }, delay)
  }
}