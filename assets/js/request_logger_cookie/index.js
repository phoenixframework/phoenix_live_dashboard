/** LiveView Hook **/

const setCookie = (params) => {
  document.cookie = `${params.key}=${params.value};samesite=strict;path=/`;
}

const removeCookie = (params) => {
  const pastDate = 'Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = `${params.key}=; expires=${pastDate}`
}

const isCookieEnabled = (hook) => {
  return hook.el.getAttribute('data-cookie-enabled') === 'true'
}

const cookieParams = (hook) => {
  return {
    key: hook.el.getAttribute('data-cookie-key'),
    value: hook.el.getAttribute('data-cookie-value')
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
