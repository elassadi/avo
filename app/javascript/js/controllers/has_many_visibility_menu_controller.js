import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['checkbox', 'fieldItem', 'selectAllCheckbox', 'selectAllItem']
  static values = {
    resourceName: String
  }

  static STORAGE_KEY = 'fields_state'

  connect() {
    // Initialize checkboxes from persisted fields_state (same as collapsible state)
    this.initializeCheckboxes()
    this.updateSelectAllState()
  }

  initializeCheckboxes() {
    const resourceState = this.getResourceState()

    this.checkboxTargets.forEach(checkbox => {
      const fieldName = checkbox.dataset.fieldName
      if (!fieldName) return // Skip select all checkbox

      const fieldState = resourceState[fieldName]
      const isVisible = this.isFieldVisible(fieldState)
      checkbox.checked = isVisible

      this.updateFieldVisibility(fieldName, isVisible)
    })
  }

  updateSelectAllState() {
    if (!this.hasSelectAllCheckboxTarget) return

    // Get only field checkboxes (exclude select all checkbox)
    const fieldCheckboxes = this.checkboxTargets.filter(checkbox => checkbox.dataset.fieldName)

    if (fieldCheckboxes.length === 0) return

    const allChecked = fieldCheckboxes.every(checkbox => checkbox.checked)
    const someChecked = fieldCheckboxes.some(checkbox => checkbox.checked)

    this.selectAllCheckboxTarget.checked = allChecked
    // Set indeterminate state if some but not all are checked
    this.selectAllCheckboxTarget.indeterminate = !allChecked && someChecked
  }

  isFieldVisible(fieldState) {
    if (fieldState == null) return true
    if (typeof fieldState === 'object' && 'visible' in fieldState) return fieldState.visible !== false
    return true
  }

  toggleField(event) {
    const checkbox = event.target
    const fieldName = checkbox.dataset.fieldName
    if (!fieldName) return // Skip if this is the select all checkbox

    const isVisible = checkbox.checked

    // Update visibility state
    this.saveFieldVisibility(fieldName, isVisible)

    // Update visibility of the field
    this.updateFieldVisibility(fieldName, isVisible)

    // Update select all checkbox state
    this.updateSelectAllState()
  }

  toggleAllFields(event) {
    const selectAllChecked = event.target.checked

    // Toggle all field checkboxes
    this.checkboxTargets.forEach(checkbox => {
      const fieldName = checkbox.dataset.fieldName
      if (!fieldName) return // Skip select all checkbox itself

      checkbox.checked = selectAllChecked

      // Update visibility state
      this.saveFieldVisibility(fieldName, selectAllChecked)

      // Update visibility of the field
      this.updateFieldVisibility(fieldName, selectAllChecked)
    })
  }

  updateFieldVisibility(fieldName, isVisible) {
    // Find all has_many collapsible components for this field and resource
    const fieldElements = document.querySelectorAll(
      `[data-has-many-collapsible-resource-name-value="${this.resourceNameValue}"][data-has-many-collapsible-field-name-value="${fieldName}"]`
    )

    fieldElements.forEach(element => {
      const collapsible = element.closest('.avo-has-many-collapsible')
      if (collapsible) {
        if (isVisible) {
          collapsible.style.display = ''
        } else {
          collapsible.style.display = 'none'
        }
      }
    })
  }

  getFieldsState() {
    try {
      const stored = localStorage.getItem(this.constructor.STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.warn('Failed to read fields_state from localStorage:', error)
      return {}
    }
  }

  getResourceState() {
    const fieldsState = this.getFieldsState()
    return fieldsState[this.resourceNameValue] || {}
  }

  saveFieldVisibility(fieldName, isVisible) {
    try {
      const fieldsState = this.getFieldsState()
      if (!fieldsState[this.resourceNameValue]) {
        fieldsState[this.resourceNameValue] = {}
      }
      const current = fieldsState[this.resourceNameValue][fieldName]
      const isObject = current != null && typeof current === 'object' && !Array.isArray(current)
      fieldsState[this.resourceNameValue][fieldName] = {
        ...(isObject ? current : { expanded: false }),
        visible: isVisible
      }
      localStorage.setItem(this.constructor.STORAGE_KEY, JSON.stringify(fieldsState))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }
}
