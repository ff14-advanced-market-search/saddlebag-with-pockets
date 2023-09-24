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
