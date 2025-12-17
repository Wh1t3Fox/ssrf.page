/**
 * Scrollspy utility for tracking active sections during scroll
 * Note: This functionality is currently built into the TableOfContents component
 * using IntersectionObserver. This file is a placeholder for any additional
 * scrollspy utilities that may be needed in the future.
 */

export function scrollToElement(elementId, options = {}) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: options.smooth !== false ? 'smooth' : 'auto',
      block: options.block || 'start',
      ...options,
    })
  }
}

export function getScrollProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return (scrollTop / docHeight) * 100
}
