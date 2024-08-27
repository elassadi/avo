import { Controller } from '@hotwired/stimulus'
import camelCase from 'lodash/camelCase'

export default class extends Controller {
  static targets = [
    'inLineSourceInput'
  ]

  static values = {
    view: String,
  }


  connect() {
    let that = this;
    this.inLineSourceInputTargets.forEach((target) => {
      that.onInlineInputChange({ target });
    });

  }

  debugOnInput(e) {
    // eslint-disable-next-line no-console
    console.log('onInput', e, e.target.value)
  }

  toggle({ params }) {
    const { toggleTarget, toggleTargets } = params

    if (toggleTarget) {
      this.toggleAvoTarget(toggleTarget)
    }

    if (toggleTargets && toggleTargets.length > 0) {
      toggleTargets.forEach(this.toggleAvoTarget.bind(this))
    }
  }

  disable({ params }) {
    const { disableTarget, disableTargets } = params

    if (disableTarget) {
      this.disableAvoTarget(disableTarget)
    }

    if (disableTargets && disableTargets.length > 0) {
      disableTargets.forEach(this.disableAvoTarget.bind(this))
    }
  }

  onInlineInputChange(e) {
    let element = e.target;
    let edit_button_id = element.dataset.inLineSourceTargetFieldId;
    let edit_button = document.getElementById(edit_button_id);

    if (edit_button) {
      let id;


      // Handle select input
      if (element.tagName.toLowerCase() === 'select') {
        let selectedOption = element.options[element.selectedIndex];
        id = selectedOption && selectedOption.value;
      }

      // Handle text input
      if (element.tagName.toLowerCase() === 'input' && element.type === 'text') {
        let hidden_element = document.querySelectorAll(`input[type=hidden][id=${element.id}]`)[0]        
        id = hidden_element.value;
      }
      // Update edit button href or hide it
      if (id && !isNaN(id)) {
        edit_button.classList.remove('hidden');
        edit_button.href = edit_button.href.replace(/\/\d+\/edit/, `/${id}/edit`);
      } else {
        edit_button.href = edit_button.href.replace(/\/\d+\/edit/, `/0/edit`);
        edit_button.classList.add('hidden');
      }
    }
  }

  // Private

  toggleAvoTarget(targetName) {
    // compose the default wrapper data value
    const target = camelCase(targetName)
    const element = document.querySelector(`[data-resource-edit-target="${target}"]`)

    if (element) {
      element.classList.toggle('hidden')
    }
  }

  disableAvoTarget(targetName) {
    // compose the default wrapper data value
    const target = camelCase(targetName)

    // find & disable direct selector
    document.querySelectorAll(`[data-resource-edit-target="${target}"]`).forEach(this.toggleItemDisabled)

    // find & disable inputs
    document.querySelectorAll(`[data-resource-edit-target="${target}"] input`).forEach(this.toggleItemDisabled)

    // find & disable select fields
    document.querySelectorAll(`[data-resource-edit-target="${target}"] select`).forEach(this.toggleItemDisabled)

    // find & disable buttons for belongs_to
    document.querySelectorAll(`[data-resource-edit-target="${target}"] [data-slot="value"] button`).forEach(this.toggleItemDisabled)
  }

  toggleItemDisabled(item) {
    item.disabled = !item.disabled
  }
}
