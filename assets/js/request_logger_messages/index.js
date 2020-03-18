/** LiveView Hook **/

const PhxRequestLoggerMessages = {
  updated() {
    if (this.el.querySelector('.logger-autoscroll-checkbox').checked) {
      const messagesElement = this.el.querySelector('#logger-messages')
      messagesElement.scrollTop = messagesElement.scrollHeight
    }
  }
}

export default PhxRequestLoggerMessages
