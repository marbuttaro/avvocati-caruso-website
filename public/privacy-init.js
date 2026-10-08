// Register before iubenda's remote configuration loads. No account credentials belong here.
window._iub = window._iub || [];
window._iub.csConfiguration = {
  callback: {
    onReady: notifyPrivacyPreferences,
    onPreferenceExpressedOrNotNeeded: notifyPrivacyPreferences,
  },
};

function notifyPrivacyPreferences() {
  // Read via the public API after iubenda has persisted the new preference.
  window.setTimeout(function () {
    window.dispatchEvent(new Event('iubenda:preferences'));
  }, 0);
}
