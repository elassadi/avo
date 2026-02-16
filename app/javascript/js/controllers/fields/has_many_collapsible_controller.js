import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['header', 'content', 'icon', 'frame']
  static values = {
    resourceName: String,
    fieldName: String,
    url: String
  }

  static STORAGE_KEY = 'fields_state'

  connect() {
    // Restore state from localStorage on page load
    const storedState = this.getStoredState()
    if (storedState === true) {
      // Expand and load content if state was saved as expanded
      this.expand(true)
    } else {
      // Ensure collapsed state (don't load content)
      this.collapse()
    }
  }

  toggle(event) {
    event.preventDefault()
    event.stopPropagation()

    if (this.isExpanded()) {
      this.collapse()
    } else {
      this.expand()
    }
  }

  expand(shouldLoad = true) {
    // Show content
    this.contentTarget.classList.remove('hidden')
    this.contentTarget.classList.add('expanded')

    // Update icon
    this.iconTarget.classList.add('expanded')

    // Load content lazily when expanding
    if (shouldLoad && this.urlValue && this.frameTarget) {
      const frameSrc = this.frameTarget.getAttribute('src')
      // If frame doesn't have src yet, set it to trigger loading
      if (!frameSrc) {
        this.frameTarget.setAttribute('src', this.urlValue)
        this.frameTarget.setAttribute('data-loading', 'true')
      } else if (!this.frameTarget.hasAttribute('data-loaded')) {
        // Reload if not already loaded (in case src was removed)
        this.frameTarget.setAttribute('src', this.urlValue)
        this.frameTarget.setAttribute('data-loading', 'true')
      }
    }

    // Save state
    this.saveState(true)
  }

  collapse() {
    // Hide content
    this.contentTarget.classList.add('hidden')
    this.contentTarget.classList.remove('expanded')

    // Update icon
    this.iconTarget.classList.remove('expanded')

    // Save state
    this.saveState(false)
  }

  onFrameLoad(event) {
    // Mark frame as loaded
    if (this.frameTarget) {
      this.frameTarget.removeAttribute('data-loading')
      this.frameTarget.setAttribute('data-loaded', 'true')
    }

    // Hide the duplicate panel title inside the loaded content
    this.hidePanelTitle()
  }

  hidePanelTitle() {
    if (!this.frameTarget) return

    // Find the panel header row that contains the title
    // The structure is: div.flex-1.flex.flex-col.xl:flex-row.justify-between.mb-4 > div > div[data-target="title"]
    const titleElement = this.frameTarget.querySelector('[data-target="title"]')
    
    if (titleElement) {
      // Find the parent header row (the one with mb-4 class)
      let parent = titleElement.parentElement
      while (parent && parent !== this.frameTarget) {
        if (parent.classList.contains('mb-4') && 
            parent.classList.contains('flex') && 
            parent.classList.contains('flex-col')) {
          parent.style.display = 'none'
          break
        }
        parent = parent.parentElement
      }
    }
  }

  isExpanded() {
    return this.contentTarget.classList.contains('expanded')
  }

  getStoredState() {
    if (!this.resourceNameValue || !this.fieldNameValue) return false

    try {
      const fieldsStateJson = localStorage.getItem(this.constructor.STORAGE_KEY)
      if (!fieldsStateJson) return false

      const fieldsState = JSON.parse(fieldsStateJson)
      const resourceState = fieldsState[this.resourceNameValue]
      
      if (!resourceState) return false
      
      return resourceState[this.fieldNameValue] === true
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return false
    }
  }

  saveState(expanded) {
    if (!this.resourceNameValue || !this.fieldNameValue) return

    try {
      // Get existing state or initialize empty object
      let fieldsState = {}
      const fieldsStateJson = localStorage.getItem(this.constructor.STORAGE_KEY)
      if (fieldsStateJson) {
        try {
          fieldsState = JSON.parse(fieldsStateJson)
        } catch (e) {
          // If parsing fails, start fresh
          fieldsState = {}
        }
      }

      // Initialize resource state if it doesn't exist
      if (!fieldsState[this.resourceNameValue]) {
        fieldsState[this.resourceNameValue] = {}
      }

      // Update field state
      fieldsState[this.resourceNameValue][this.fieldNameValue] = expanded

      // Save back to localStorage
      localStorage.setItem(this.constructor.STORAGE_KEY, JSON.stringify(fieldsState))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }
}
