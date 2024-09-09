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

  handleKeydown(event) {


    const activeModal = document.querySelector('.modal-container') // the primary modal
    const detachedForm = document.querySelector('form.aa-Form[role="search"]') // the specific form

    // If the detached form is present and active (focused), prevent key events in the main modal
    if (detachedForm && detachedForm.contains(document.activeElement)) {
      // Prevent key handling in the main modal if the search form is active
      return
    }

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
