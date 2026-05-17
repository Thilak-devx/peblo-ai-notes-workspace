const authTokenStorageKey = "peblo-auth-token";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getStoredAuthToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(authTokenStorageKey);
}

export function setStoredAuthToken(token: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(authTokenStorageKey, token);
}

export function clearStoredAuthToken() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(authTokenStorageKey);
}
