export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function formatButtonLabel(action: string) {
  return `${action.trim().replace(/\s+/g, " ")} →`;
}
