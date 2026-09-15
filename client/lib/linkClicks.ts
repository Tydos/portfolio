/** Mouse event fields that decide between client-side and native navigation. */
export interface LinkClickLike {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

/**
 * Whether a link click should be intercepted for client-side navigation.
 *
 * Modified and non-primary clicks are how browsers express "open this
 * somewhere else" (new tab on Cmd/Ctrl, new window on Shift, download on
 * Alt in Chromium). Those must fall through to the anchor's `href` so the
 * behaviour matches every other link on the page.
 *
 * @param event - Click event to classify.
 * @returns True when the handler may call `preventDefault` and route itself.
 */
export function shouldInterceptLinkClick(event: LinkClickLike): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
