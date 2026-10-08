// Public document identifiers from the carusoavvocati.it iubenda dashboard.
export const privacyUrl = 'https://www.iubenda.com/privacy-policy/13388967';
export const cookieUrl = `${privacyUrl}/cookie-policy`;

export function openCookiePreferences() {
  const api = window._iub?.cs?.api;
  if (api?.openPreferences) {
    api.openPreferences();
  } else {
    // Keep the policy accessible when a blocker or network error prevents the CMP loading.
    window.location.assign(cookieUrl);
  }
}
