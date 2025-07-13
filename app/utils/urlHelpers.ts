/**
 * Safely extracts URL search parameters
 * @param url The URL to parse
 * @returns Object with success and error parameters
 */
export const extractUrlParams = (url: string) => {
  try {
    const urlObj = new URL(url)
    return {
      success: urlObj.searchParams.get('success'),
      error: urlObj.searchParams.get('error')
    }
  } catch (e) {
    return { success: null, error: null }
  }
}

/**
 * Safely extracts URL parameters from window.location
 * @returns Object with success and error parameters
 */
export const getWindowUrlParams = () => {
  if (typeof window === 'undefined' || !window.location) {
    return { success: null, error: null }
  }

  return extractUrlParams(window.location.href)
}
