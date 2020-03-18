/** LiveView Hook **/

const copyToClipboard = (textarea) => {
    if (!navigator.clipboard){
      // Deprecated clipboard API
      textarea.select()
      textarea.setSelectionRange(0, 99999)
      document.execCommand('copy')
    } else {
      // Modern Clipboard API
      const text = textarea.value
      navigator.clipboard.writeText(text)
    }
  }

const PhxRequestLoggerQueryParameter = {
  mounted() {
    this.el.querySelector('.btn-primary').addEventListener('click', e => {
      const textarea = this.el.querySelector('textarea')
      copyToClipboard(textarea)
      const copyIndicator = this.el.querySelector('.copy-indicator')
      copyIndicator.setAttribute('data-enabled', 'false')
      void copyIndicator.offsetWidth // Resets the animation to ensure it will be played again
      copyIndicator.setAttribute('data-enabled', 'true')
    })
  }
}

export default PhxRequestLoggerQueryParameter
