/**
 * Copies the current document URL to the clipboard when triggered by a button click.
 * @example
 * sync(event)
 * // Alerts: 'Address copied to clipboard'
 * @param {React.MouseEvent<HTMLButtonElement>} e - The mouse event triggered by clicking the button.
 * @returns {void} No return value.
 * @description
 *   - The function only works in secure contexts (HTTPS).
 *   - Displays an alert message if the operation fails or succeeds.
 */
export const handleCopyButton = async (
  e: React.MouseEvent<HTMLButtonElement>
) => {
  e.preventDefault()
  if (!window || !document) {
    return
  }

  if (!window.isSecureContext) {
    alert('Failed to copy address to clipboard.')
    return
  }

  await navigator.clipboard.writeText(document.URL)

  alert('Address copied to clipboard')
}

/**
 * Updates the URL's query parameter with a new value without reloading the page.
 * @example
 * updateParamInURL('page', '2')
 * // Changes the URL from 'http://example.com/?page=1' to 'http://example.com/?page=2'
 * @param {string} paramName - The name of the query parameter to update.
 * @param {string | undefined} newValue - The new value to set for the specified query parameter. If undefined, the parameter is removed.
 * @returns {void} This function does not return a value.
 * @description
 *   - The function relies on the `document` and `window` objects being accessible.
 *   - Uses the History API to update the URL without causing a page reload.
 *   - If `newValue` is undefined, the parameter is effectively removed from the URL.
 */
export const handleSearchParamChange = (
  paramName: string,
  newValue: string | undefined
) => {
  if (!document || !window) return
  const url = new window.URL(document.URL)

  if (newValue) {
    url.searchParams.set(paramName, newValue)
  }

  window.history.replaceState({}, '', url.toString())
}

export const getActionUrl = (pageUrl: string, params: Record<string, any>) => {
  const paramString = Object.entries(params)
    .filter(([_key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  return `${pageUrl}?${paramString}`
}
