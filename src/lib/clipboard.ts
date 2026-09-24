/**
 * Safe clipboard copy utility supporting both:
 * 1. Modern Clipboard API (navigator.clipboard) in Secure Contexts (HTTPS / localhost)
 * 2. Fallback using document.execCommand('copy') for Insecure Contexts (e.g. plain HTTP over IP like 10.12.3.3 or local domains)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // 1. Try modern Clipboard API if available and inside a Secure Context
  try {
    if (
      typeof window !== 'undefined' &&
      Boolean(window.isSecureContext) &&
      typeof navigator !== 'undefined' &&
      Boolean(navigator?.clipboard) &&
      typeof navigator.clipboard?.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // If permission is denied or blocked, fall through to fallback
  }

  // 2. Fallback to document.execCommand('copy') with temporary textarea for insecure HTTP contexts
  try {
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // Style to prevent scrolling or zooming
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  } catch (err) {
    console.warn('Fallback copy to clipboard failed:', err);
  }

  return false;
}
