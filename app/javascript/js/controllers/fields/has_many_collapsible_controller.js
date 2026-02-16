import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['header', 'content', 'icon', 'iconWrapper', 'iconPlus', 'iconMinus', 'frame']
  static values = {
    resourceName: String,
    fieldName: String,
    url: String
  }

  static STORAGE_KEY = 'fields_state'

  connect() {
    // Check visibility state first (hides section if user chose to hide it)
    this.checkVisibility()

    // Don't expand or load content when the field is hidden
    if (!this.isVisible()) {
      this.collapse()
      return
    }

    // Restore expanded state from localStorage only when visible
    const storedState = this.getStoredState()
    if (storedState === true) {
      this.expand(true)
    } else {
      this.collapse()
    }
  }

  isVisible() {
    const visibilityState = this.getVisibilityState()
    const resourceName = this.resourceNameValue
    const fieldName = this.fieldNameValue
    if (!resourceName || !fieldName) return true
    return visibilityState[resourceName]?.[fieldName] !== false
  }

  checkVisibility() {
    if (!this.isVisible()) {
      this.element.closest('.avo-has-many-collapsible').style.display = 'none'
    }
  }

  getVisibilityState() {
    const fieldsState = this.getFieldsState()
    const resourceState = fieldsState[this.resourceNameValue]
    if (!resourceState) return {}
    const result = {}
    Object.keys(resourceState).forEach(fieldName => {
      const raw = resourceState[fieldName]
      result[fieldName] = typeof raw === 'object' && raw != null && 'visible' in raw ? raw.visible !== false : true
    })
    return { [this.resourceNameValue]: result }
  }

  toggle(event) {
    event.preventDefault()
    event.stopPropagation()

    const expanding = !this.isExpanded()
    const fieldName = this.fieldNameValue || 'unknown'
    console.debug('[has-many-collapsible] toggle:', { field: fieldName, expanding })

    if (this.isExpanded()) {
      this.collapse()
    } else {
      this.expand()
    }
  }

  expand(shouldLoad = true) {
    // Never load content when the field is hidden (user unchecked it in visibility menu)
    if (!this.isVisible()) {
      this.collapse()
      return
    }

    const fieldName = this.fieldNameValue || 'unknown'
    console.debug('[has-many-collapsible] expand:', { field: fieldName, shouldLoad })

    // Show content
    this.contentTarget.classList.remove('hidden')
    this.contentTarget.classList.add('expanded')

    // Switch icon: show minus, hide plus (JS toggle so it works regardless of component CSS)
    if (this.hasIconPlusTarget && this.hasIconMinusTarget) {
      this.iconPlusTarget.classList.add('hidden')
      this.iconMinusTarget.classList.remove('hidden')
    } else if (this.hasIconWrapperTarget) {
      this.iconWrapperTarget.classList.add('expanded')
    } else if (this.hasIconTarget) {
      this.iconTarget.classList.add('expanded')
    }

    // Load content lazily when expanding (only when visible)
    if (shouldLoad && this.urlValue && this.frameTarget) {
      const frameSrc = this.frameTarget.getAttribute('src')
      if (!frameSrc) {
        this.frameTarget.setAttribute('src', this.urlValue)
        this.frameTarget.setAttribute('data-loading', 'true')
      } else if (!this.frameTarget.hasAttribute('data-loaded')) {
        this.frameTarget.setAttribute('src', this.urlValue)
        this.frameTarget.setAttribute('data-loading', 'true')
      }
    }

    // Save state
    this.saveState(true)
  }

  collapse() {
    const fieldName = this.fieldNameValue || 'unknown'
    console.debug('[has-many-collapsible] collapse:', { field: fieldName })

    // Hide content
    this.contentTarget.classList.add('hidden')
    this.contentTarget.classList.remove('expanded')

    // Switch icon: show plus, hide minus
    if (this.hasIconPlusTarget && this.hasIconMinusTarget) {
      this.iconPlusTarget.classList.remove('hidden')
      this.iconMinusTarget.classList.add('hidden')
    } else if (this.hasIconWrapperTarget) {
      this.iconWrapperTarget.classList.remove('expanded')
    } else if (this.hasIconTarget) {
      this.iconTarget.classList.remove('expanded')
    }

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
      const raw = this.getFieldState()
      if (raw == null) return false
      // Support legacy boolean (expanded only) or new shape { expanded, visible }
      return typeof raw === 'boolean' ? raw : (raw.expanded === true)
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return false
    }
  }

  getFieldState() {
    const fieldsState = this.getFieldsState()
    const resourceState = fieldsState[this.resourceNameValue]
    if (!resourceState) return null
    return resourceState[this.fieldNameValue]
  }

  getFieldsState() {
    try {
      const fieldsStateJson = localStorage.getItem(this.constructor.STORAGE_KEY)
      return fieldsStateJson ? JSON.parse(fieldsStateJson) : {}
    } catch (e) {
      return {}
    }
  }

  saveState(expanded) {
    if (!this.resourceNameValue || !this.fieldNameValue) return

    try {
      const fieldsState = this.getFieldsState()
      if (!fieldsState[this.resourceNameValue]) {
        fieldsState[this.resourceNameValue] = {}
      }
      const current = fieldsState[this.resourceNameValue][this.fieldNameValue]
      const isObject = current != null && typeof current === 'object' && !Array.isArray(current)
      fieldsState[this.resourceNameValue][this.fieldNameValue] = {
        ...(isObject ? current : { visible: true }),
        expanded
      }
      localStorage.setItem(this.constructor.STORAGE_KEY, JSON.stringify(fieldsState))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }
}
