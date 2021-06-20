const REFRESH_DATA_COOKIE = "_refresh_data";

/**
 * Stores refresh data in the `"refresh_data"` cookie.
 */
export function storeRefreshData(refreshData) {
  const json = JSON.stringify(refreshData);
  const encoded = encodeBase64(json);
  setCookie(REFRESH_DATA_COOKIE, encoded, 157680000); // 5 years
}

/**
 * Loads refresh data from the `"refresh_data"` cookie.
 */
export function loadRefreshData() {
  const encoded = getCookieValue(REFRESH_DATA_COOKIE);
  if (encoded) {
    const json = decodeBase64(encoded);
    return JSON.parse(json);
  } else {
    return null;
  }
}

function getCookieValue(key) {
  const cookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${key}=`));

  if (cookie) {
    const value = cookie.replace(`${key}=`, "");
    return value;
  } else {
    return null;
  }
}

function setCookie(key, value, maxAge) {
  const cookie = `${key}=${value};max-age=${maxAge};path=/`;
  document.cookie = cookie;
}

function encodeBase64(string) {
  return btoa(unescape(encodeURIComponent(string)));
}

function decodeBase64(binary) {
  return decodeURIComponent(escape(atob(binary)));
}
