import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['modal']



  connect() {
    this.setupKeyBindings()
  }
  disconnect() {
    this.removeKeyBindings()
  }

  close() {
    this.modalTarget.remove()

    document.dispatchEvent(new Event('actions-modal:close'))
  }

  delayedClose() {
    const vm = this

    setTimeout(() => {
      vm.modalTarget.remove()
      document.dispatchEvent(new Event('actions-modal:close'))
    }, 500)
  }


  setupKeyBindings() {
    this.form = this.modalTarget.querySelector('form')
    if (this.form) {
      this.keydownHandler = this.handleKeydown.bind(this)
      document.addEventListener('keydown', this.keydownHandler)
    }
  }

  removeKeyBindings() {
    if (this.form && this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler)
    }
  }

  __handleKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      const submitButton = this.modalTarget.querySelector('button[type="submit"]')
      if (submitButton) {
        submitButton.click()
      }
    } else if (event.key === 'Escape') {
      this.close()
    }
  }

  handleKeydown(event) {
    if (event.key === 'Enter' && !event.ctrlKey) {
      // Prevent form submission on Enter, unless Ctrl is pressed
      const activeElement = document.activeElement
      if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'TRIX-EDITOR') {
        return
      }
      event.preventDefault()
      const submitButton = this.modalTarget.querySelector('button[type="submit"]')
      if (submitButton) {
        submitButton.click()
      }
    } else if (event.key === 'Enter' && event.ctrlKey) {
      // Allow form submission only if Ctrl + Enter is pressed
      const submitButton = this.modalTarget.querySelector('button[type="submit"]')
      if (submitButton) {
        event.preventDefault()
        submitButton.click()
      }
    } else if (event.key === 'Escape') {
      this.close()
    }
  }
}
