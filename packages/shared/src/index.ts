export const SHARED_CONSTANT = 'Shared logic initialized';

export function getSharedMessage(): string {
  return `Message from shared: ${SHARED_CONSTANT}`;
}
