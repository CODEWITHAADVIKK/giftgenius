/**
 * Input sanitization utilities.
 * Strips potentially dangerous content from user inputs.
 */

/**
 * Sanitize user-provided strings in a context-agnostic way.
 * This is defense-in-depth; output should still be encoded for the target context.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
}

/** Sanitize an email address */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return "";

  let normalized = email.toLowerCase().trim();
  normalized = normalized.replace(/[<>"'`&\u0000-\u001F\u007F-\u009F]/g, "");
  normalized = sanitizeString(normalized);
  return normalized.slice(0, 254);
}

/** Deep sanitize an object's string values */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    const value = sanitized[key];
    if (typeof value === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = value.map((item) => {
        if (typeof item === "string") return sanitizeString(item);
        if (item !== null && typeof item === "object") {
          return sanitizeObject(item as Record<string, unknown>);
        }
        return item;
      });
    } else if (typeof value === "object" && value !== null) {
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>
      );
    }
  }
  return sanitized;
}
