import { Controller } from '@hotwired/stimulus'
import camelCase from 'lodash/camelCase'

export default class extends Controller {
  static targets = [
    'inLineSourceInput',
    'deviceBelongsToWrapper'
  ]

  static values = {
    view: String,
  }


  connect() {
    console.log("resource edit controller connected");

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
    console.log('onInlineInputChange')

    //const inlineSourceName = this.element.dataset.inlineSourceName;
    //const initialValue = this.element.dataset.initialValue;

    //console.log("Inline Source Name:", inlineSourceName);
    //console.log("Initial Value:", initialValue);

    let element = e.target;

    let edit_button_id = element.dataset.inLineSourceTargetFieldId;

    let edit_button = document.getElementById(edit_button_id);

    if (edit_button) {
      let selectedOption = element.options[element.selectedIndex];
      if (selectedOption && selectedOption.value) {
        edit_button.classList.remove('hidden');
        let id = selectedOption.value;
        edit_button.href = edit_button.href.replace(/\/\d+\/edit/, `/${id}/edit`);
      }else {
        edit_button.classList.add('hidden');
      }
    }
  }

  // onInlineEditClick(event) {
  //   console.log('onInlineEditClick');
  //   event.preventDefault(); // Prevent default anchor click behavior

  //   // Find the related select input based on data-inline-source-input-field
  //   const inputFieldId = event.currentTarget.dataset.inlineSourceInputField;
  //   const selectElement = this.inLineSourceInputTargets.find(
  //     (target) => target.id === inputFieldId
  //   );


  //   console.log("selectElement");
  //   console.log(selectElement);
  //   console.log("inputFieldId");
  //   console.log(inputFieldId);

  //   if (selectElement) {
  //     const selectedValue = selectElement.value;
  //     if (selectedValue) {
  //       // Update the href attribute dynamically
  //       const newHref = `/resources/devices/${selectedValue}/edit`;
  //       newHref = event.currentTarget.href
  //       id = 279;
  //       event.currentTarget.href = event.currentTarget.href.replace(/\/\d+\/edit/, `/${id}/edit`);

  //       const turboFrame = event.currentTarget.getAttribute("data-turbo-frame");
  //       console.log("turboFrame");
  //       console.log(turboFrame);
  //       if (turboFrame) {
  //         // Use Turbo to navigate within the specified frame
  //         Turbo.visit(newHref, { frame: turboFrame });
  //       } else {
  //         // Optionally, you can manually trigger the navigation
  //         //window.location.href = newHref;
  //       }
  //     }
  //   }
  // }

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
