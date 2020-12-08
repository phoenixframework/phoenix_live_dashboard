const interactiveItemSelector = '.progress-bar, .color-bar-legend-entry'
let highlightedElementName

const highlightElements = (containerElement) => {
  containerElement.querySelectorAll(interactiveItemSelector).forEach((progressBarElement) => {
    if(highlightedElementName) {
      const isMuted = progressBarElement.getAttribute('data-name') !== highlightedElementName

      progressBarElement.setAttribute('data-muted', isMuted)
    } else {
      progressBarElement.removeAttribute('data-muted')
    }
  })
}

const PhxColorBarHighlight = {
  mounted() {
    this.el.setAttribute('data-highlight-enabled', 'true')
    this.el.querySelectorAll(interactiveItemSelector).forEach((progressBarElement) => (
      progressBarElement.addEventListener('click', e => {
        const name = e.currentTarget.getAttribute('data-name')
        highlightedElementName = name === highlightedElementName ? null : name
        highlightElements(this.el)
      })
    ))
  },

  updated() {
    this.el.setAttribute('data-highlight-enabled', 'true')
    highlightElements(this.el)
  }
}

export default PhxColorBarHighlight
