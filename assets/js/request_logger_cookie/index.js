/** LiveView Hook **/

const setCookie = (params) => {
  let cookie = `${params.key}=${params.value};path=/`
  if (window.location.protocol === "https:") {
    cookie += `;samesite=strict`
  }
  if (params.domain) {
    cookie += `;domain=${params.domain}`
  }
  document.cookie = cookie
}

const removeCookie = (params) => {
  const pastDate = 'Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = `${params.key}=; expires=${pastDate}`
}

const isCookieEnabled = (hook) => {
  return hook.el.hasAttribute('data-cookie-enabled')
}

const cookieParams = (hook) => {
  return {
    key: hook.el.getAttribute('data-cookie-key'),
    value: hook.el.getAttribute('data-cookie-value'),
    domain: hook.el.getAttribute('data-cookie-domain')
  }
}

const PhxRequestLoggerCookie = {
  updated() {
    const loggerCookieParams = cookieParams(this)
    removeCookie(loggerCookieParams)

    if (isCookieEnabled(this)) {
      setCookie(loggerCookieParams)
    }
  },
}

export default PhxRequestLoggerCookie
