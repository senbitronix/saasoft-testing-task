import type { TLabel } from '@/types/account'

export function stringToLabelArray(inputString: string | undefined | null): TLabel[] {
  if (!inputString) {
    return []
  }

  const labels = inputString.split(';')
  const result = labels.map((label) => ({ text: label.trim() }))
  return result
}

export function labelArrayToString(labelArray: TLabel[]): string {
  if (!labelArray || labelArray.length === 0) {
    return ''
  }

  const labels = labelArray.map((label) => label.text.trim())
  const result = labels.join(';')
  return result
}

export function loadFromCache(name = 'accounts') {
  const cachedItems = localStorage.getItem(name)
  return cachedItems ? JSON.parse(cachedItems) : []
}

export function saveInCache<T>(items: T[], name = 'accounts') {
  localStorage.setItem(name, JSON.stringify(items))
}
